export const SchemaType = {
  OBJECT: "OBJECT",
  STRING: "STRING",
  NUMBER: "NUMBER",
  INTEGER: "INTEGER",
  BOOLEAN: "BOOLEAN",
  ARRAY: "ARRAY",
} as const;

export const VOS_FUNCTION_DECLARATIONS: any[] = [
  // 1. NAVIGATION
  {
    name: "vos_navigate",
    description: "Navigates the user screen to a specific application route in VOS.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        route: {
          type: SchemaType.STRING,
          description: "Target route, e.g. '/', '/modules/placement', '/companies', '/documents', '/calendar', '/streak', '/modules/cgl', '/modules/youtube', '/modules/exams', '/analytics', '/system'",
        },
        description: { type: SchemaType.STRING, description: "Brief explanation of why navigating" },
      },
      required: ["route"],
    },
  },
  {
    name: "vos_open_entity",
    description: "Deep-links to open a specific subject, module, topic, company, or document in VOS.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        entity_type: {
          type: SchemaType.STRING,
          description: "Type of entity: 'subject', 'module', 'topic', 'company', 'document'",
        },
        subject_id: { type: SchemaType.STRING, description: "Subject ID if opening a subject or module" },
        module_name: { type: SchemaType.STRING, description: "Exact module name, e.g. 'Module 10: Recursion Basics'" },
        topic_id: { type: SchemaType.STRING, description: "Topic ID if opening a topic" },
        company_id: { type: SchemaType.STRING, description: "Company ID" },
        document_id: { type: SchemaType.STRING, description: "Document ID" },
      },
      required: ["entity_type"],
    },
  },

  // 2. TIMETABLE
  {
    name: "vos_get_timetable",
    description: "Fetches scheduled timeblocks from the user daily timetable.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        day_of_week: {
          type: SchemaType.INTEGER,
          description: "Day number 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat. Omit for today schedule.",
        },
      },
    },
  },
  {
    name: "vos_create_timetable_block",
    description: "Creates a new timeblock in the daily timetable in Supabase.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING, description: "Title of the timeblock, e.g. 'Java + DSA — Alpha Batch'" },
        start_time: { type: SchemaType.STRING, description: "Start time 'HH:MM:SS' or 'HH:MM' (24-hr format)" },
        end_time: { type: SchemaType.STRING, description: "End time 'HH:MM:SS' or 'HH:MM' (24-hr format)" },
        day_of_week: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.INTEGER },
          description: "Array of days (0=Sun, 1=Mon, ..., 6=Sat) when this block applies.",
        },
        category: {
          type: SchemaType.STRING,
          description: "Category: 'Deep Work', 'Learning', 'Career', 'Life', 'Review', 'Health', 'General'",
        },
        priority: { type: SchemaType.STRING, description: "'HIGH', 'MEDIUM', or 'LOW'" },
      },
      required: ["title", "start_time", "end_time", "day_of_week"],
    },
  },
  {
    name: "vos_update_timetable_block",
    description: "Updates an existing timetable block by ID or title.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "ID of the timetable block" },
        title: { type: SchemaType.STRING, description: "New title or query match" },
        start_time: { type: SchemaType.STRING, description: "New start time 'HH:MM:SS'" },
        end_time: { type: SchemaType.STRING, description: "New end time 'HH:MM:SS'" },
        day_of_week: { type: SchemaType.ARRAY, items: { type: SchemaType.INTEGER } },
        category: { type: SchemaType.STRING },
        priority: { type: SchemaType.STRING },
      },
      required: ["id"],
    },
  },
  {
    name: "vos_delete_timetable_block",
    description: "Deletes a timetable block from the database by ID or title.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "ID of the block to delete" },
        title: { type: SchemaType.STRING, description: "Title of the block if ID unknown" },
      },
    },
  },
  {
    name: "vos_bulk_import_timetable",
    description: "Bulk creates or updates a full weekly timetable schedule from extracted or structured data.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        blocks: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              start_time: { type: SchemaType.STRING },
              end_time: { type: SchemaType.STRING },
              day_of_week: { type: SchemaType.ARRAY, items: { type: SchemaType.INTEGER } },
              category: { type: SchemaType.STRING },
              priority: { type: SchemaType.STRING },
            },
            required: ["title", "start_time", "end_time", "day_of_week"],
          },
          description: "List of timetable blocks to add",
        },
        mode: { type: SchemaType.STRING, description: "'merge' to keep existing blocks, or 'replace' to replace matching days" },
      },
      required: ["blocks"],
    },
  },

  // 3. SUBJECTS & TOPICS (TRACKER)
  {
    name: "vos_create_subject",
    description: "Creates a new Subject in a module (e.g. Placement, CGL, Exams).",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        name: { type: SchemaType.STRING, description: "Name of the subject (e.g. 'DBMS', 'Operating Systems', 'Quantitative Aptitude')" },
        module: { type: SchemaType.STRING, description: "Module: 'PLACEMENT', 'CGL', 'EXAMS', 'YOUTUBE', or 'GENERAL'" },
        description: { type: SchemaType.STRING, description: "Optional subject description" },
      },
      required: ["name"],
    },
  },
  {
    name: "vos_rename_subject",
    description: "Renames an existing Subject.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "Subject ID" },
        name: { type: SchemaType.STRING, description: "Current name of the subject if ID unknown" },
        new_name: { type: SchemaType.STRING, description: "New name for the subject" },
      },
      required: ["new_name"],
    },
  },
  {
    name: "vos_delete_subject",
    description: "Deletes a Subject and all its associated topics from VOS.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "Subject ID" },
        name: { type: SchemaType.STRING, description: "Subject name if ID unknown" },
      },
    },
  },
  {
    name: "vos_create_topic",
    description: "Creates a new topic or video item inside a Subject/Module in the tracker.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        subject_id: { type: SchemaType.STRING, description: "Subject ID" },
        subject_name: { type: SchemaType.STRING, description: "Subject Name if ID unknown (e.g. 'DSA', 'DBMS')" },
        name: { type: SchemaType.STRING, description: "Topic/Video title (e.g. '1. Introduction to Trees')" },
        description: { type: SchemaType.STRING, description: "Folder or Module name (e.g. 'Module 25: Binary Trees')" },
        duration: { type: SchemaType.STRING, description: "Duration in MM:SS (e.g. '14:20')" },
        difficulty: { type: SchemaType.STRING, description: "'Easy', 'Medium', or 'Hard'" },
      },
      required: ["name"],
    },
  },
  {
    name: "vos_update_topic",
    description: "Updates a topic name, module folder, duration, or difficulty.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "Topic ID" },
        name: { type: SchemaType.STRING, description: "Current topic name if ID unknown" },
        new_name: { type: SchemaType.STRING, description: "New topic name" },
        description: { type: SchemaType.STRING, description: "New module description" },
        duration: { type: SchemaType.STRING, description: "New duration" },
        difficulty: { type: SchemaType.STRING, description: "'Easy', 'Medium', or 'Hard'" },
      },
    },
  },
  {
    name: "vos_update_topic_milestone",
    description: "Toggles or sets the 4 progress milestones for a topic: learned, practiced, revised, mastered.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "Topic ID" },
        topic_name: { type: SchemaType.STRING, description: "Topic name if ID unknown" },
        milestone: {
          type: SchemaType.STRING,
          description: "Milestone: 'is_learned', 'is_practiced', 'is_revised', or 'is_mastered'",
        },
        value: { type: SchemaType.BOOLEAN, description: "true to check, false to uncheck" },
      },
      required: ["milestone", "value"],
    },
  },
  {
    name: "vos_delete_topic",
    description: "Deletes a topic from the tracker by ID or name.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "Topic ID" },
        name: { type: SchemaType.STRING, description: "Topic name if ID unknown" },
      },
    },
  },
  {
    name: "vos_bulk_import_syllabus",
    description: "Bulk imports an entire syllabus/video playlist into a subject.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        subject_id: { type: SchemaType.STRING, description: "Subject ID" },
        subject_name: { type: SchemaType.STRING, description: "Subject name (e.g. 'DSA', 'DBMS', 'OS')" },
        module_name: { type: SchemaType.STRING, description: "Default module folder if applicable" },
        topics: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
              duration: { type: SchemaType.STRING },
              difficulty: { type: SchemaType.STRING },
            },
            required: ["name"],
          },
          description: "List of topics to import",
        },
      },
      required: ["topics"],
    },
  },

  // 4. COMPANIES ATS TRACKER
  {
    name: "vos_get_companies",
    description: "Retrieves company applications from the ATS tracker.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        status: { type: SchemaType.STRING, description: "Filter by status: 'Saved', 'Applied', 'Interview', 'Offer', 'Rejected'" },
      },
    },
  },
  {
    name: "vos_create_company",
    description: "Adds a new company job application to the personal ATS tracker.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        company_name: { type: SchemaType.STRING, description: "Company name (e.g. 'Google', 'Microsoft', 'TCS')" },
        role: { type: SchemaType.STRING, description: "Job title (e.g. 'Software Engineer', 'Frontend Dev')" },
        status: { type: SchemaType.STRING, description: "'Saved', 'Applied', 'Interview', 'Offer', 'Rejected'" },
        applied_date: { type: SchemaType.STRING, description: "Date applied 'YYYY-MM-DD'" },
        job_link: { type: SchemaType.STRING, description: "URL to job posting" },
        location: { type: SchemaType.STRING, description: "Location (e.g. 'Remote', 'Bangalore')" },
        notes: { type: SchemaType.STRING, description: "Notes about salary, interview rounds, etc." },
      },
      required: ["company_name", "role", "status"],
    },
  },
  {
    name: "vos_update_company",
    description: "Updates an existing company application details or status.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "Company record ID" },
        company_name: { type: SchemaType.STRING, description: "Company name if ID unknown" },
        status: { type: SchemaType.STRING, description: "'Saved', 'Applied', 'Interview', 'Offer', 'Rejected'" },
        role: { type: SchemaType.STRING },
        notes: { type: SchemaType.STRING },
        location: { type: SchemaType.STRING },
      },
    },
  },
  {
    name: "vos_delete_company",
    description: "Removes a company application from the ATS tracker.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "Company ID" },
        company_name: { type: SchemaType.STRING, description: "Company name if ID unknown" },
      },
    },
  },

  // 5. TASKS & PRIORITIES
  {
    name: "vos_get_tasks",
    description: "Fetches active priority tasks from the dashboard.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        completed: { type: SchemaType.BOOLEAN, description: "Filter by completion status" },
      },
    },
  },
  {
    name: "vos_create_task",
    description: "Creates a new priority task on the Vijaypath dashboard.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING, description: "Task title" },
        category: { type: SchemaType.STRING, description: "Category (e.g. 'DSA', 'Core', 'Career', 'Life')" },
        priority_level: { type: SchemaType.STRING, description: "'HIGH', 'MEDIUM', or 'LOW'" },
        due_date: { type: SchemaType.STRING, description: "Due date 'YYYY-MM-DD'" },
        subtitle: { type: SchemaType.STRING, description: "Subtitle/details" },
      },
      required: ["title"],
    },
  },
  {
    name: "vos_update_task",
    description: "Updates a task title, priority level, due date, or category.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "Task ID" },
        title: { type: SchemaType.STRING, description: "Current task title if ID unknown" },
        new_title: { type: SchemaType.STRING },
        priority_level: { type: SchemaType.STRING, description: "'HIGH', 'MEDIUM', 'LOW'" },
        due_date: { type: SchemaType.STRING },
        category: { type: SchemaType.STRING },
      },
    },
  },
  {
    name: "vos_toggle_task",
    description: "Marks a priority task as completed or incomplete.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "Task ID" },
        title: { type: SchemaType.STRING, description: "Task title if ID unknown" },
        completed: { type: SchemaType.BOOLEAN, description: "true for complete, false for pending" },
      },
      required: ["completed"],
    },
  },
  {
    name: "vos_delete_task",
    description: "Deletes a priority task from the dashboard.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "Task ID" },
        title: { type: SchemaType.STRING, description: "Task title if ID unknown" },
      },
    },
  },

  // 6. NOTES & DOCUMENTS
  {
    name: "vos_create_note",
    description: "Creates a new rich note in a specified module.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING, description: "Title of the note" },
        content: { type: SchemaType.STRING, description: "Markdown or body text of note" },
        module: { type: SchemaType.STRING, description: "'GENERAL', 'EXAMS', 'YOUTUBE', 'CGL', or 'PLACEMENT'" },
        category: { type: SchemaType.STRING, description: "Optional category" },
        tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Tags array" },
      },
      required: ["title", "content", "module"],
    },
  },
  {
    name: "vos_update_note",
    description: "Updates an existing note title, content, or tags.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "Note ID" },
        title: { type: SchemaType.STRING, description: "Current note title if ID unknown" },
        new_title: { type: SchemaType.STRING },
        content: { type: SchemaType.STRING },
        category: { type: SchemaType.STRING },
        tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      },
    },
  },
  {
    name: "vos_delete_note",
    description: "Deletes a note by ID or title.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        id: { type: SchemaType.STRING, description: "Note ID" },
        title: { type: SchemaType.STRING, description: "Note title if ID unknown" },
      },
    },
  },
  {
    name: "vos_create_document",
    description: "Registers a new document or file in the Digital Documents Vault.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        name: { type: SchemaType.STRING, description: "Document title" },
        type: { type: SchemaType.STRING, description: "'PDF', 'Image', 'Doc', etc." },
        category: { type: SchemaType.STRING, description: "'Identity', 'Resume', 'Certificates', 'Academic'" },
        download_url: { type: SchemaType.STRING, description: "URL or local storage path" },
        folder_id: { type: SchemaType.STRING, description: "Folder ID in documents vault" },
      },
      required: ["name"],
    },
  },
  {
    name: "vos_search_documents",
    description: "Searches documents vault for matching files, metadata, and tags.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: { type: SchemaType.STRING, description: "Search query" },
      },
      required: ["query"],
    },
  },

  // 7. SEARCH & WEB
  {
    name: "vos_global_search",
    description: "Searches globally across all VOS tables: topics, subjects, companies, documents, tasks, timetable, and notes.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: { type: SchemaType.STRING, description: "Search query" },
      },
      required: ["query"],
    },
  },
  {
    name: "vos_web_search",
    description: "Performs live web search for current information, official notifications, documentation, or study resources.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: { type: SchemaType.STRING, description: "Web search query" },
        max_results: { type: SchemaType.INTEGER, description: "Number of search results (default 5)" },
      },
      required: ["query"],
    },
  },
  {
    name: "vos_fetch_webpage",
    description: "Fetches and reads text content from a web URL for deep analysis or summarization.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        url: { type: SchemaType.STRING, description: "Full URL of webpage to read" },
      },
      required: ["url"],
    },
  },

  // 8. GENERAL AI
  {
    name: "vos_translate_explain",
    description: "Translates text between English and Hindi, explains concepts, or provides cognitive summaries.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        text: { type: SchemaType.STRING, description: "Text or word to translate/explain" },
        action: { type: SchemaType.STRING, description: "'translate_to_hindi', 'translate_to_english', 'explain_concept', 'summarize'" },
      },
      required: ["text", "action"],
    },
  },
];