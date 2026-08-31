import React from 'react';

export default function QuestionModal({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingQuestionId,
  isDark
}) {
  if (!show) return null;

  const handleTypeChange = (newType) => {
    let newChoices = formData.choices;

    if (newType === 'TrueFalse') {
      newChoices = [
        { text: 'True', isCorrect: true, order: 1 },
        { text: 'False', isCorrect: false, order: 2 }
      ];
    } else if (newType === 'MCQ' && formData.choices.length === 0) {
      newChoices = [
        { text: '', isCorrect: false, order: 1 },
        { text: '', isCorrect: false, order: 2 }
      ];
    } else if (newType === 'ShortAnswer') {
      newChoices = [];
    }

    setFormData({
      ...formData,
      type: newType,
      choices: newChoices
    });
  };

  const handleChoiceChange = (index, field, value) => {
    const updatedChoices = [...formData.choices];
    updatedChoices[index][field] = value;

    if (field === 'isCorrect' && value === true) {
      updatedChoices.forEach((c, i) => {
        if (i !== index) c.isCorrect = false;
      });
    }

    setFormData({ ...formData, choices: updatedChoices });
  };

  const addChoiceOption = () => {
    setFormData({
      ...formData,
      choices: [
        ...formData.choices,
        { text: '', isCorrect: false, order: formData.choices.length + 1 }
      ]
    });
  };

  const removeChoiceOption = (index) => {
    const updatedChoices = formData.choices.filter((_, i) => i !== index);
    setFormData({ ...formData, choices: updatedChoices });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-xl p-6 rounded-2xl border shadow-xl ${
        isDark ? 'bg-[#0B132B] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <h3 className="text-lg font-bold mb-4">
          {editingQuestionId ? 'Edit Question' : 'Add Question'}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Question Statement</label>
            <textarea
              required
              rows={2}
              value={formData.statement}
              onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
              className={`w-full p-3 rounded-xl border text-sm focus:outline-none ${
                isDark ? 'bg-[#060B19] border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
              }`}
              placeholder="Ex: Is HTML a programming language?"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Question Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-sm focus:outline-none ${
                  isDark ? 'bg-[#060B19] border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <option value="MCQ">Multiple Choice (MCQ)</option>
                <option value="TrueFalse">True / False</option>
                <option value="ShortAnswer">Short Answer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Points</label>
              <input
                type="number"
                min="1"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border text-sm focus:outline-none ${
                  isDark ? 'bg-[#060B19] border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>
          </div>

          {formData.type !== 'ShortAnswer' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-400">
                  {formData.type === 'TrueFalse' ? 'Select the correct answer' : 'Answer Options'}
                </label>
                {formData.type === 'MCQ' && (
                  <button
                    type="button"
                    onClick={addChoiceOption}
                    className="text-xs font-medium text-blue-500 hover:text-blue-400"
                  >
                    + Add Option
                  </button>
                )}
              </div>

              {formData.choices.map((choice, index) => (
                <div key={choice._id || index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctChoice"
                    checked={choice.isCorrect}
                    onChange={(e) => handleChoiceChange(index, 'isCorrect', e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <input
                    type="text"
                    required
                    readOnly={formData.type === 'TrueFalse'} 
                    placeholder={`Option ${index + 1}`}
                    value={choice.text}
                    onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
                    className={`flex-1 p-2 rounded-xl border text-sm focus:outline-none ${
                      isDark ? 'bg-[#060B19] border-slate-800 text-white' : 'bg-slate-50 border-slate-200'
                    } ${formData.type === 'TrueFalse' ? 'opacity-80 font-semibold' : ''}`}
                  />
                  {formData.type === 'MCQ' && formData.choices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChoiceOption(index)}
                      className="text-slate-500 hover:text-rose-500 text-sm px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {formData.type === 'ShortAnswer' && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
              💡 Short answers will be written directly by the student and evaluated via the backend logic.
           </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
            >
              {editingQuestionId ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}