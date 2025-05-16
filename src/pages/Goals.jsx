import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import getIcon from "../utils/iconUtils";

// Icon components
const PlusIcon = getIcon("Plus");
const EditIcon = getIcon("Edit");
const TrashIcon = getIcon("Trash");
const XIcon = getIcon("X");
const CalendarIcon = getIcon("Calendar");
const TrophyIcon = getIcon("Trophy");
const TargetIcon = getIcon("Target");
const DollarSignIcon = getIcon("DollarSign");

function Goals() {
  // State for goals
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("goals");
    return savedGoals ? JSON.parse(savedGoals) : [
      {
        id: 1,
        name: "Emergency Fund",
        target: 10000,
        current: 5000,
        targetDate: "2023-12-31",
        category: "Savings"
      },
      {
        id: 2,
        name: "New Car",
        target: 25000,
        current: 8000,
        targetDate: "2024-06-30",
        category: "Purchase"
      }
    ];
  });

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGoal, setCurrentGoal] = useState({
    name: "",
    target: "",
    current: "",
    targetDate: "",
    category: "Savings"
  });

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentGoal({
      ...currentGoal,
      [name]: name === "target" || name === "current" ? parseFloat(value) || 0 : value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!currentGoal.name) {
      toast.error("Goal name is required");
      return;
    }
    
    if (!currentGoal.target || currentGoal.target <= 0) {
      toast.error("Target amount must be greater than zero");
      return;
    }
    
    if (currentGoal.current < 0) {
      toast.error("Current amount cannot be negative");
      return;
    }
    
    if (!currentGoal.targetDate) {
      toast.error("Target date is required");
      return;
    }

    if (isEditing) {
      // Update existing goal
      setGoals(goals.map(goal => 
        goal.id === currentGoal.id ? currentGoal : goal
      ));
      toast.success("Goal updated successfully!");
    } else {
      // Add new goal
      const newGoal = {
        ...currentGoal,
        id: Date.now(),
      };
      setGoals([...goals, newGoal]);
      toast.success("New goal added successfully!");
    }

    // Reset and close modal
    closeModal();
  };

  // Delete goal
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      setGoals(goals.filter(goal => goal.id !== id));
      toast.info("Goal deleted");
    }
  };

  // Edit goal
  const handleEdit = (goal) => {
    setCurrentGoal(goal);
    setIsEditing(true);
    setShowModal(true);
  };

  // Add new goal
  const handleAddGoal = () => {
    setCurrentGoal({
      name: "",
      target: "",
      current: 0,
      targetDate: "",
      category: "Savings"
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setShowModal(false);
    setCurrentGoal({
      name: "",
      target: "",
      current: 0,
      targetDate: "",
      category: "Savings"
    });
    setIsEditing(false);
  };

  // Calculate progress percentage
  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Goals</h1>
        <button
          onClick={handleAddGoal}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon size={18} />
          <span>Add Goal</span>
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12 bg-surface-50 dark:bg-surface-800 rounded-xl">
          <TrophyIcon size={48} className="mx-auto text-surface-400" />
          <h3 className="mt-4 text-xl font-medium">No goals yet</h3>
          <p className="mt-2 text-surface-500">Add your first financial goal to start tracking progress</p>
          <button
            onClick={handleAddGoal}
            className="mt-4 btn-primary"
          >
            Add Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white dark:bg-surface-800 rounded-xl shadow-soft p-4 border border-surface-200 dark:border-surface-700">
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">{goal.name}</h3>
                <div className="badge-accent">{goal.category}</div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500">Progress</span>
                  <span className="font-medium">
                    ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
                  </span>
                </div>
                
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5">
                  <div
                    className="bg-accent h-2.5 rounded-full" 
                    style={{ width: `${calculateProgress(goal.current, goal.target)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500 flex items-center gap-1">
                    <CalendarIcon size={14} />
                    Target Date
                  </span>
                  <span className="font-medium">{format(new Date(goal.targetDate), 'MMM d, yyyy')}</span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(goal)}
                  className="btn-outline btn-sm"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="btn-outline btn-sm text-error hover:bg-error/10"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding/editing goals */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-bold">{isEditing ? "Edit Goal" : "Add New Goal"}</h3>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
                <XIcon size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Goal Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TargetIcon size={16} className="text-surface-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter goal name"
                    value={currentGoal.name}
                    onChange={handleInputChange}
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="target" className="form-label">Target Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSignIcon size={16} className="text-surface-400" />
                  </div>
                  <input
                    type="number"
                    id="target"
                    name="target"
                    placeholder="Enter target amount"
                    value={currentGoal.target}
                    onChange={handleInputChange}
                    className="form-input pl-10"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="current" className="form-label">Current Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSignIcon size={16} className="text-surface-400" />
                  </div>
                  <input
                    type="number"
                    id="current"
                    name="current"
                    placeholder="Enter current amount"
                    value={currentGoal.current}
                    onChange={handleInputChange}
                    className="form-input pl-10"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="targetDate" className="form-label">Target Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon size={16} className="text-surface-400" />
                  </div>
                  <input
                    type="date"
                    id="targetDate"
                    name="targetDate"
                    value={currentGoal.targetDate}
                    onChange={handleInputChange}
                    className="form-input pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                  id="category"
                  name="category"
                  value={currentGoal.category}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="Savings">Savings</option>
                  <option value="Investment">Investment</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Debt Repayment">Debt Repayment</option>
                  <option value="Education">Education</option>
                  <option value="Retirement">Retirement</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={closeModal} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {isEditing ? "Update Goal" : "Add Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;