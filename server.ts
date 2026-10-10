import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUserByUid, updateUserCredentialId } from './src/db/users.ts';
import {
  getAllIdAllocations,
  upsertIdAllocation,
  getCourses,
  upsertCourse,
  deleteCourse,
  getNews,
  upsertNews,
  deleteNews,
  getDoctors,
  upsertDoctor,
  deleteDoctor,
  getResources,
  upsertResource,
  deleteResource,
  getAuditLogs,
  insertAuditLog,
  clearAuditLogs,
} from './src/db/repository.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ limit: '25mb', extended: true }));

  // -------------------------------------------------------------
  // HEALTH & TELEMETRY
  // -------------------------------------------------------------
  app.get('/api/health', async (_req: Request, res: Response) => {
    try {
      res.json({
        status: 'ok',
        database: 'Cloud SQL (PostgreSQL)',
        auth: 'Firebase Auth',
        region: process.env.SQL_HOST ? 'connected' : 'local-proxy',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Health check failed' });
    }
  });

  // -------------------------------------------------------------
  // USER PROFILES & AUTH SYNCHRONIZATION
  // -------------------------------------------------------------
  app.get('/api/me', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const user = await getUserByUid(uid);
      res.json(user);
    } catch (err: any) {
      console.error('Error fetching current user:', err);
      res.status(500).json({ error: err.message || 'Failed to fetch user' });
    }
  });

  app.post('/api/users/sync', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || req.body.email || '';
      const displayName = req.body.displayName || req.user!.name || '';
      const photoUrl = req.body.photoUrl || req.user!.picture || '';

      const user = await getOrCreateUser(uid, email, displayName, photoUrl);
      res.json(user);
    } catch (err: any) {
      console.error('Error syncing user:', err);
      res.status(500).json({ error: err.message || 'Failed to sync user' });
    }
  });

  app.post('/api/users/link-credential', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const uid = req.user!.uid;
      const { credentialId } = req.body;
      if (!credentialId) {
        return res.status(400).json({ error: 'Missing credentialId' });
      }
      const updated = await updateUserCredentialId(uid, credentialId);
      res.json(updated);
    } catch (err: any) {
      console.error('Error linking credential:', err);
      res.status(500).json({ error: err.message || 'Failed to link credential' });
    }
  });

  // -------------------------------------------------------------
  // ID ALLOCATIONS (SOVEREIGN 4,000 KEYSTORE)
  // -------------------------------------------------------------
  app.get('/api/ids', async (_req: Request, res: Response) => {
    try {
      const allocations = await getAllIdAllocations();
      res.json(allocations);
    } catch (err: any) {
      console.error('Error retrieving ID allocations:', err);
      res.status(500).json({ error: err.message || 'Failed to get ID allocations' });
    }
  });

  app.post('/api/ids/upsert', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
      const item = req.body;
      if (!item || !item.id) {
        return res.status(400).json({ error: 'Invalid ID allocation payload' });
      }
      const saved = await upsertIdAllocation(item);
      res.json(saved);
    } catch (err: any) {
      console.error('Error upserting ID allocation:', err);
      res.status(500).json({ error: err.message || 'Failed to save ID allocation' });
    }
  });

  // -------------------------------------------------------------
  // COURSES (READ, WRITE, PERMANENT CLOUD DELETE)
  // -------------------------------------------------------------
  app.get('/api/courses', async (_req: Request, res: Response) => {
    try {
      const courses = await getCourses();
      res.json(courses);
    } catch (err: any) {
      console.error('Error retrieving courses:', err);
      res.status(500).json({ error: err.message || 'Failed to get courses' });
    }
  });

  app.post('/api/courses', async (req: Request, res: Response) => {
    try {
      const course = req.body;
      const saved = await upsertCourse(course);
      res.json(saved);
    } catch (err: any) {
      console.error('Error saving course:', err);
      res.status(500).json({ error: err.message || 'Failed to save course' });
    }
  });

  app.delete('/api/courses/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const deleted = await deleteCourse(id);
      res.json({ success: true, deleted, id });
    } catch (err: any) {
      console.error('Error deleting course from Cloud SQL:', err);
      res.status(500).json({ error: err.message || 'Failed to delete course' });
    }
  });

  // Course PDF Upload Route (Handbooks, Slides, Clinical Syllabus)
  app.post('/api/upload-course-pdf', async (req: Request, res: Response) => {
    try {
      const { dataUrl, filename } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ error: 'No dataUrl provided' });
      }
      const base64Data = dataUrl
        .replace(/^data:application\/pdf;base64,/, '')
        .replace(/^data:application\/[a-zA-Z0-9.-]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const uploadsDir = path.join(__dirname, 'public', 'uploads', 'courses');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const distUploadsDir = path.join(__dirname, 'dist', 'uploads', 'courses');
      if (!fs.existsSync(distUploadsDir)) {
        fs.mkdirSync(distUploadsDir, { recursive: true });
      }

      const safeName = (filename || 'handbook')
        .replace(/[^a-zA-Z0-9_.-]/g, '_')
        .substring(0, 50);
      const fileName = `course_${Date.now()}_${safeName.endsWith('.pdf') ? safeName : safeName + '.pdf'}`;
      const targetPath = path.join(uploadsDir, fileName);
      fs.writeFileSync(targetPath, buffer);
      if (fs.existsSync(distUploadsDir)) {
        fs.writeFileSync(path.join(distUploadsDir, fileName), buffer);
      }
      const relativeUrl = `/uploads/courses/${fileName}`;
      res.json({ success: true, url: relativeUrl, name: filename || fileName });
    } catch (err: any) {
      console.error('Error saving course PDF:', err);
      res.status(500).json({ error: err.message || 'Failed to upload PDF' });
    }
  });

  // Universal PDF Upload Route (For News decrees, Doctor CVs, Guidelines, Resources)
  app.post('/api/upload-pdf', async (req: Request, res: Response) => {
    try {
      const { dataUrl, filename, section } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ error: 'No dataUrl provided' });
      }
      const base64Data = dataUrl
        .replace(/^data:application\/pdf;base64,/, '')
        .replace(/^data:application\/[a-zA-Z0-9.-]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const uploadsDir = path.join(__dirname, 'public', 'uploads', 'docs');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const distUploadsDir = path.join(__dirname, 'dist', 'uploads', 'docs');
      if (!fs.existsSync(distUploadsDir)) {
        fs.mkdirSync(distUploadsDir, { recursive: true });
      }

      const prefix = section ? `${section}_` : 'doc_';
      const safeName = (filename || 'document')
        .replace(/[^a-zA-Z0-9_.-]/g, '_')
        .substring(0, 50);
      const fileName = `${prefix}${Date.now()}_${safeName.endsWith('.pdf') ? safeName : safeName + '.pdf'}`;
      const targetPath = path.join(uploadsDir, fileName);
      fs.writeFileSync(targetPath, buffer);
      if (fs.existsSync(distUploadsDir)) {
        fs.writeFileSync(path.join(distUploadsDir, fileName), buffer);
      }
      const relativeUrl = `/uploads/docs/${fileName}`;
      res.json({ success: true, url: relativeUrl, name: filename || fileName });
    } catch (err: any) {
      console.error('Error saving PDF document:', err);
      res.status(500).json({ error: err.message || 'Failed to upload PDF document' });
    }
  });

  // Universal Image Upload Route (For News banners, decree photos, resources)
  app.post('/api/upload-image', async (req: Request, res: Response) => {
    try {
      const { dataUrl, filename, section } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ error: 'No dataUrl provided' });
      }
      const match = dataUrl.match(/^data:image\/(\w+);base64,/);
      const ext = match ? match[1] : 'jpg';
      const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const uploadsDir = path.join(__dirname, 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const distUploadsDir = path.join(__dirname, 'dist', 'uploads');
      if (!fs.existsSync(distUploadsDir)) {
        fs.mkdirSync(distUploadsDir, { recursive: true });
      }

      const prefix = section ? `${section}_` : 'img_';
      const safeName = (filename || 'image')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 30);
      const fileName = `${prefix}${Date.now()}_${safeName}.${ext === 'jpeg' ? 'jpg' : ext}`;
      const targetPath = path.join(uploadsDir, fileName);
      fs.writeFileSync(targetPath, buffer);
      if (fs.existsSync(distUploadsDir)) {
        fs.writeFileSync(path.join(distUploadsDir, fileName), buffer);
      }
      const relativeUrl = `/uploads/${fileName}`;
      res.json({ success: true, url: relativeUrl, name: filename || fileName });
    } catch (err: any) {
      console.error('Error saving image:', err);
      res.status(500).json({ error: err.message || 'Failed to upload image' });
    }
  });

  // -------------------------------------------------------------
  // NEWS & DISPATCHES (READ, WRITE, PERMANENT CLOUD DELETE)
  // -------------------------------------------------------------
  app.get('/api/news', async (_req: Request, res: Response) => {
    try {
      const news = await getNews();
      res.json(news);
    } catch (err: any) {
      console.error('Error retrieving news:', err);
      res.status(500).json({ error: err.message || 'Failed to get news' });
    }
  });

  app.post('/api/news', async (req: Request, res: Response) => {
    try {
      const item = req.body;
      const saved = await upsertNews(item);
      res.json(saved);
    } catch (err: any) {
      console.error('Error saving news:', err);
      res.status(500).json({ error: err.message || 'Failed to save news' });
    }
  });

  app.delete('/api/news/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const deleted = await deleteNews(id);
      res.json({ success: true, deleted, id });
    } catch (err: any) {
      console.error('Error deleting news from Cloud SQL:', err);
      res.status(500).json({ error: err.message || 'Failed to delete news' });
    }
  });

  // -------------------------------------------------------------
  // DOCTORS REGISTRY (READ, WRITE, PERMANENT CLOUD DELETE)
  // -------------------------------------------------------------
  app.get('/api/doctors', async (_req: Request, res: Response) => {
    try {
      const doctors = await getDoctors();
      res.json(doctors);
    } catch (err: any) {
      console.error('Error retrieving doctors:', err);
      res.status(500).json({ error: err.message || 'Failed to get doctors' });
    }
  });

  app.post('/api/doctors', async (req: Request, res: Response) => {
    try {
      const doc = req.body;
      const saved = await upsertDoctor(doc);
      res.json(saved);
    } catch (err: any) {
      console.error('Error saving doctor:', err);
      res.status(500).json({ error: err.message || 'Failed to save doctor' });
    }
  });

  // Direct Photo Upload Route - Writes exact user/admin image file to disk with 0 edits
  app.post('/api/upload-doctor-photo', async (req: Request, res: Response) => {
    try {
      const { dataUrl, filename, doctorId } = req.body;
      if (!dataUrl) {
        return res.status(400).json({ error: 'No dataUrl provided' });
      }
      const match = dataUrl.match(/^data:image\/(\w+);base64,/);
      const ext = match ? match[1] : 'jpg';
      const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const uploadsDir = path.join(__dirname, 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const distUploadsDir = path.join(__dirname, 'dist', 'uploads');
      if (!fs.existsSync(distUploadsDir)) {
        fs.mkdirSync(distUploadsDir, { recursive: true });
      }

      let relativeUrl = '';
      if (doctorId === 'SDI-0010' || (filename && filename.toLowerCase().includes('dr-al-samoual-awad'))) {
        const publicPath = path.join(__dirname, 'public', 'dr-al-samoual-awad.jpg');
        fs.writeFileSync(publicPath, buffer);
        const distDir = path.join(__dirname, 'dist');
        if (fs.existsSync(distDir)) {
          fs.writeFileSync(path.join(distDir, 'dr-al-samoual-awad.jpg'), buffer);
        }
        relativeUrl = `/dr-al-samoual-awad.jpg?t=${Date.now()}`;
      } else {
        const safeName = (filename || 'doctor')
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .substring(0, 30);
        const fileName = `doc_${Date.now()}_${safeName}.${ext === 'jpeg' ? 'jpg' : ext}`;
        const targetPath = path.join(uploadsDir, fileName);
        fs.writeFileSync(targetPath, buffer);
        if (fs.existsSync(distUploadsDir)) {
          fs.writeFileSync(path.join(distUploadsDir, fileName), buffer);
        }
        relativeUrl = `/uploads/${fileName}`;
      }

      res.json({ success: true, url: relativeUrl });
    } catch (err: any) {
      console.error('Error saving doctor photo:', err);
      res.status(500).json({ error: err.message || 'Failed to upload photo' });
    }
  });

  app.delete('/api/doctors/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const deleted = await deleteDoctor(id);
      res.json({ success: true, deleted, id });
    } catch (err: any) {
      console.error('Error deleting doctor from Cloud SQL:', err);
      res.status(500).json({ error: err.message || 'Failed to delete doctor' });
    }
  });

  // -------------------------------------------------------------
  // RESOURCES, DOCUMENTS & CIRCULARS (READ, WRITE, CLOUD DELETE)
  // -------------------------------------------------------------
  app.get('/api/resources', async (_req: Request, res: Response) => {
    try {
      const resources = await getResources();
      res.json(resources);
    } catch (err: any) {
      console.error('Error retrieving resources:', err);
      res.status(500).json({ error: err.message || 'Failed to get resources' });
    }
  });

  app.post('/api/resources', async (req: Request, res: Response) => {
    try {
      const resource = req.body;
      const saved = await upsertResource(resource);
      res.json(saved);
    } catch (err: any) {
      console.error('Error saving resource to Cloud SQL:', err);
      res.status(500).json({ error: err.message || 'Failed to save resource' });
    }
  });

  app.delete('/api/resources/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const deleted = await deleteResource(id);
      res.json({ success: true, deleted, id });
    } catch (err: any) {
      console.error('Error deleting resource from Cloud SQL:', err);
      res.status(500).json({ error: err.message || 'Failed to delete resource' });
    }
  });

  // -------------------------------------------------------------
  // AUDIT LOGS (READ, WRITE, CLEAR)
  // -------------------------------------------------------------
  app.get('/api/audit-logs', async (_req: Request, res: Response) => {
    try {
      const logs = await getAuditLogs();
      res.json(logs);
    } catch (err: any) {
      console.error('Error retrieving audit logs:', err);
      res.status(500).json({ error: err.message || 'Failed to get audit logs' });
    }
  });

  app.post('/api/audit-logs', async (req: Request, res: Response) => {
    try {
      const log = req.body;
      const saved = await insertAuditLog(log);
      res.json(saved);
    } catch (err: any) {
      console.error('Error recording audit log:', err);
      res.status(500).json({ error: err.message || 'Failed to record audit log' });
    }
  });

  app.delete('/api/audit-logs', async (_req: Request, res: Response) => {
    try {
      await clearAuditLogs();
      res.json({ success: true, cleared: true });
    } catch (err: any) {
      console.error('Error clearing audit logs in Cloud SQL:', err);
      res.status(500).json({ error: err.message || 'Failed to clear audit logs' });
    }
  });

  // -------------------------------------------------------------
  // FRONTEND & STATIC ASSET SERVING (Vite in Dev, Dist in Prod)
  // -------------------------------------------------------------
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`SDI Full-Stack Cloud SQL Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
