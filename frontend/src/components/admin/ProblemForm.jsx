// src/components/admin/ProblemForm.jsx

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-hot-toast';

// Define the 5 languages from your schema
const LANGUAGES = ['c++', 'java', 'python', 'c', 'javascript'];

// Define default values to populate the form
const defaultProblemValues = {
  title: "",
  description: "",
  difficulty: "Easy",
  tags: "",
  visibleTestCases: [{ input: "", output: "", explanation: "" }],
  hiddenTestCases: [{ input: "", output: "" }],
  startCode: LANGUAGES.map(lang => ({
    language: lang,
    initialCode: ""
  })),
  referenceCode: LANGUAGES.map(lang => ({
    language: lang,
    solutionCode: ""
  }))
};

const ProblemForm = ({ mode, problemId, onSuccess, onCancel, onDelete }) => {
  const [loading, setLoading] = useState(false);
  
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: defaultProblemValues
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: "visibleTestCases" });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: "hiddenTestCases" });

  useEffect(() => {
    if (mode === 'edit' && problemId) {
      setLoading(true);
      axiosClient.get(`/problem/${problemId}`)
        .then(response => {
          const dbProblem = response.data;
          
          const massagedData = {
            ...dbProblem,
            tags: dbProblem.tags.join(', '),
            
            startCode: LANGUAGES.map(lang => {
              const found = dbProblem.startCode.find(s => s.language === lang);
              return found || { language: lang, initialCode: '' };
            }),
            
            referenceCode: LANGUAGES.map(lang => {
              const found = dbProblem.referenceCode.find(s => s.language === lang);
              return found || { language: lang, solutionCode: '' };
            })
          };
          
          reset(massagedData); 
        })
        .catch(err => toast.error("Failed to load problem data."))
        .finally(() => setLoading(false));
    } else {
      reset(defaultProblemValues);
    }
  }, [mode, problemId, reset]);
  
  const onSubmit = async (data) => {
    setLoading(true);

    const transformedData = {
      ...data,
      tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      startCode: data.startCode.filter(s => s.initialCode.trim() !== ''),
      referenceCode: data.referenceCode.filter(s => s.solutionCode.trim() !== '')
    };

    try {
      if (mode === 'create') {
        const response = await axiosClient.post('/problem/create', transformedData);
        toast.success(response.data); 
      } else {
        const response = await axiosClient.put(`/problem/update/${problemId}`, transformedData);
        toast.success(response.data.message); 
      }
      onSuccess(); 
    
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMsg = `Validation Failed:\n${err.response.data.errors.join('\n')}`;
        toast.error(errorMsg, { duration: 6000 });
      } else {
        toast.error(err.response?.data || "An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this problem? This action cannot be undone.")) {
      setLoading(true);
      try {
        await axiosClient.delete(`/problem/delete/${problemId}`);
        toast.success("Problem deleted successfully!");
        onDelete(); 
      } catch (err) {
        toast.error(err.response?.data || "Failed to delete problem.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl h-full flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="p-4 border-b border-base-300">
          <h2 className="card-title">
            {mode === 'create' ? 'Create New Problem' : 'Edit Problem'}
          </h2>
        </div>

        <div className="card-body p-6 overflow-y-auto">
          {loading && <span className="loading loading-spinner m-auto"></span>}

          {!loading && (
            <div className="space-y-4">
              {/* Title */}
              <div className="form-control">
                <label className="label"><span className="label-text">Title</span></label>
                <input type="text" className={`input input-bordered ${errors.title ? 'input-error' : ''}`} {...register("title")} />
              </div>

              {/* Difficulty */}
              <div className="form-control">
                <label className="label"><span className="label-text">Difficulty</span></label>
                <select className="select select-bordered" {...register("difficulty")}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              {/* Tags */}
              <div className="form-control">
                <label className="label"><span className="label-text">Tags (comma-separated)</span></label>
                <input type="text" placeholder="Array, Math, Hash Table" className={`input input-bordered ${errors.tags ? 'input-error' : ''}`} {...register("tags")} />
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label"><span className="label-text">Description (Markdown supported)</span></label>
                <textarea className="textarea textarea-bordered h-40 font-mono" {...register("description")}></textarea>
              </div>

              {/* --- Visible Test Cases (Dynamic) --- */}
              <div>
                <h3 className="text-lg font-semibold mt-4 mb-2">Visible Test Cases</h3>
                {visibleFields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-base-300 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Test Case {index + 1}</span>
                      {index > 0 && <button type="button" className="btn btn-sm btn-error btn-outline" onClick={() => removeVisible(index)}>Remove</button>}
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Input</span></label>
                      <textarea className="textarea textarea-bordered font-mono h-20" {...register(`visibleTestCases.${index}.input`)}></textarea>
                    </div>
                    <div className="form-control mt-2">
                      <label className="label"><span className="label-text">Output</span></label>
                      <textarea className="textarea textarea-bordered font-mono h-20" {...register(`visibleTestCases.${index}.output`)}></textarea>
                    </div>
                    <div className="form-control mt-2">
                      <label className="label"><span className="label-text">Explanation</span></label>
                      <input type="text" className="input input-bordered" {...register(`visibleTestCases.${index}.explanation`)} />
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline btn-success mt-2" onClick={() => appendVisible({ input: "", output: "", explanation: "" })}>
                  + Add Visible Test Case
                </button>
              </div>

              {/* --- Hidden Test Cases (Dynamic) --- */}
              <div>
                <h3 className="text-lg font-semibold mt-4 mb-2">Hidden Test Cases</h3>
                {hiddenFields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-base-300 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Test Case {index + 1}</span>
                      {index > 0 && <button type="button" className="btn btn-sm btn-error btn-outline" onClick={() => removeHidden(index)}>Remove</button>}
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text">Input</span></label>
                      <textarea className="textarea textarea-bordered font-mono h-20" {...register(`hiddenTestCases.${index}.input`)}></textarea>
                    </div>
                    <div className="form-control mt-2">
                      <label className="label"><span className="label-text">Output</span></label>
                      <textarea className="textarea textarea-bordered font-mono h-20" {...register(`hiddenTestCases.${index}.output`)}></textarea>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline btn-success mt-2" onClick={() => appendHidden({ input: "", output: "" })}>
                  + Add Hidden Test Case
                </button>
              </div>

              {/* --- Start Code (Static 5 Languages) --- */}
              <div>
                <h3 className="text-lg font-semibold mt-4 mb-2">Function Stubs (Start Code)</h3>
                <div className="space-y-4">
                  {LANGUAGES.map((lang, index) => (
                    <div key={lang} className="form-control">
                      <label className="label"><span className="label-text font-medium">{lang}</span></label>
                      <input type="hidden" {...register(`startCode.${index}.language`)} value={lang} />
                      <textarea className="textarea textarea-bordered font-mono h-32" {...register(`startCode.${index}.initialCode`)}></textarea>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- Reference Code (Static 5 Languages) --- */}
              <div>
                <h3 className="text-lg font-semibold mt-4 mb-2">Reference Solutions</h3>
                <div className="space-y-4">
                  {LANGUAGES.map((lang, index) => (
                    <div key={lang} className="form-control">
                      <label className="label"><span className="label-text font-medium">{lang}</span></label>
                      <input type="hidden" {...register(`referenceCode.${index}.language`)} value={lang} />
                      <textarea className="textarea textarea-bordered font-mono h-32" {...register(`referenceCode.${index}.solutionCode`)}></textarea>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* --- Form Footer --- */}
        <div className="p-4 border-t border-base-300">
          <div className="flex justify-between">
            <div>
              {mode === 'edit' && (
                <button 
                  type="button" 
                  className="btn btn-error" 
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-4">
              <button 
                type="button" 
                className="btn btn-ghost" 
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {mode === 'create' ? 'Create Problem' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProblemForm;