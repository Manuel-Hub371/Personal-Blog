const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new project
// @route   POST /api/projects
exports.createProject = async (req, res) => {
    const project = new Project({
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        link: req.body.link,
        githubLink: req.body.githubLink,
        image: req.body.image,
        technologies: req.body.technologies
    });

    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            project.title = req.body.title || project.title;
            project.description = req.body.description || project.description;
            project.content = req.body.content || project.content;
            project.link = req.body.link || project.link;
            project.githubLink = req.body.githubLink || project.githubLink;
            project.image = req.body.image || project.image;
            project.technologies = req.body.technologies || project.technologies;

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
