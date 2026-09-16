import { Router } from 'express';
import { dbService } from '../services/db.js';
import { analyzeComplaintText } from '../services/aiService.js';

const router = Router();

// 1. Analyze complaint preview with AI (before final submission)
router.post('/analyze', async (req, res) => {
  try {
    const { title, description } = req.body;
    const fullText = `${title || ''} ${description || ''}`.trim();

    if (!fullText) {
      return res.status(400).json({ error: 'Complaint text is required for AI analysis' });
    }

    const aiResult = await analyzeComplaintText(fullText);
    res.json(aiResult);
  } catch (err) {
    console.error('Error analyzing complaint:', err);
    res.status(500).json({ error: 'Failed to analyze complaint' });
  }
});

// 2. Get statistics for admin dashboard
router.get('/stats', async (req, res) => {
  try {
    const stats = await dbService.getStatistics();
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// 3. Get all complaints with filtering
router.get('/', async (req, res) => {
  try {
    const { userId, status, category, priority, department, search } = req.query;
    const complaints = await dbService.getAllComplaints({
      userId,
      status,
      category,
      priority,
      department,
      search
    });
    res.json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// 4. Get complaint by ID
router.get('/:id', async (req, res) => {
  try {
    const complaint = await dbService.getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (err) {
    console.error('Error fetching complaint:', err);
    res.status(500).json({ error: 'Failed to fetch complaint' });
  }
});

// 5. Create new complaint
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      userId,
      citizenName,
      citizenEmail,
      citizenPhone,
      latitude,
      longitude,
      address,
      imageUrl,
      videoUrl,
      // Optional pre-reviewed AI values
      category: clientCategory,
      severity: clientSeverity,
      priority: clientPriority,
      department: clientDept,
      aiSummary: clientSummary
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Run AI analysis if not already supplied from review step
    let aiData = {
      category: clientCategory,
      severity: clientSeverity,
      priority: clientPriority,
      department: clientDept,
      summary: clientSummary
    };

    if (!aiData.category || !aiData.department) {
      const fullText = `${title} ${description}`;
      const aiResult = await analyzeComplaintText(fullText);
      aiData = {
        category: aiResult.category,
        severity: aiResult.severity,
        priority: aiResult.priority,
        department: aiResult.department,
        summary: aiResult.summary
      };
    }

    const complaint = await dbService.createComplaint({
      title,
      description,
      userId,
      citizenName,
      citizenEmail,
      citizenPhone,
      category: aiData.category,
      severity: aiData.severity,
      priority: aiData.priority,
      department: aiData.department,
      aiSummary: aiData.summary,
      imageUrl,
      videoUrl,
      latitude,
      longitude,
      address
    });

    res.status(201).json({
      message: 'Complaint successfully registered',
      complaint
    });
  } catch (err) {
    console.error('Error creating complaint:', err);
    res.status(500).json({ error: 'Failed to register complaint' });
  }
});

// 6. Update complaint status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await dbService.updateStatus(req.params.id, status, remarks);
    if (!updated) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({
      message: 'Status updated successfully',
      complaint: updated
    });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// 7. Assign department
router.put('/:id/assign', async (req, res) => {
  try {
    const { department, remarks } = req.body;
    if (!department) {
      return res.status(400).json({ error: 'Department is required' });
    }

    const updated = await dbService.assignDepartment(req.params.id, department, remarks);
    if (!updated) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({
      message: 'Department assigned successfully',
      complaint: updated
    });
  } catch (err) {
    console.error('Error assigning department:', err);
    res.status(500).json({ error: 'Failed to assign department' });
  }
});

// 8. Add remarks
router.post('/:id/remarks', async (req, res) => {
  try {
    const { remarks } = req.body;
    if (!remarks) {
      return res.status(400).json({ error: 'Remarks text is required' });
    }

    const updated = await dbService.addRemarks(req.params.id, remarks);
    if (!updated) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({
      message: 'Remarks added successfully',
      complaint: updated
    });
  } catch (err) {
    console.error('Error adding remarks:', err);
    res.status(500).json({ error: 'Failed to add remarks' });
  }
});

export default router;
