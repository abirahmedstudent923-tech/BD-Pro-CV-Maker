import React from 'react';
import { Project } from '../../types/cv';
import { FolderGit2, Plus, Trash2 } from 'lucide-react';

interface Props {
  projects: Project[];
  onChange: (items: Project[]) => void;
  lang: 'en' | 'bn';
}

export const ProjectsForm: React.FC<Props> = ({ projects, onChange, lang }) => {
  const isBn = lang === 'bn';

  const handleAdd = () => {
    const newItem: Project = {
      id: `proj-${Date.now()}`,
      title: '',
      role: '',
      technologies: '',
      link: '',
      description: '',
    };
    onChange([...projects, newItem]);
  };

  const handleRemove = (index: number) => {
    onChange(projects.filter((_, idx) => idx !== index));
  };

  const handleChange = (index: number, field: keyof Project, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3 text-xs">
      {projects.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-slate-200 rounded-lg">
          <FolderGit2 className="w-6 h-6 text-slate-300 mx-auto mb-1" />
          <p className="text-slate-500 text-[11px]">
            {isBn ? 'কোনো প্রজেক্ট বা পোর্টফোলিও যোগ করা হয়নি' : 'No projects added yet'}
          </p>
        </div>
      ) : (
        projects.map((item, index) => (
          <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative">
            <div className="flex justify-between items-center pb-1 border-b border-slate-200">
              <span className="font-semibold text-slate-700">
                {isBn ? `প্রজেক্ট #${index + 1}` : `Project #${index + 1}`}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-rose-500 hover:text-rose-700 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  placeholder="Project Title (e.g. EkSheba Citizen Portal)"
                  value={item.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  className="w-full p-1.5 border rounded text-xs bg-white font-medium"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Your Role (e.g. Lead Developer / UI Designer)"
                  value={item.role}
                  onChange={(e) => handleChange(index, 'role', e.target.value)}
                  className="w-full p-1.5 border rounded text-xs bg-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Technologies Used (e.g. React, Node.js, PostgreSQL)"
                  value={item.technologies}
                  onChange={(e) => handleChange(index, 'technologies', e.target.value)}
                  className="w-full p-1.5 border rounded text-xs bg-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Live URL or GitHub Link (e.g. github.com/...)"
                  value={item.link}
                  onChange={(e) => handleChange(index, 'link', e.target.value)}
                  className="w-full p-1.5 border rounded text-xs bg-white"
                />
              </div>
            </div>

            <textarea
              rows={2}
              placeholder="Brief description of the project and key accomplishments..."
              value={item.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              className="w-full p-1.5 border rounded text-xs bg-white leading-relaxed"
            />
          </div>
        ))
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-slate-300 transition"
      >
        <Plus className="w-3.5 h-3.5" /> {isBn ? 'প্রজেক্ট যোগ করুন' : 'Add Project'}
      </button>
    </div>
  );
};
