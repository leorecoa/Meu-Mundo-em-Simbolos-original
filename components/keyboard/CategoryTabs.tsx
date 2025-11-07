import React from 'react';

interface Category {
    id: string;
    name: string;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  showPhrases: boolean;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategory, onCategoryChange, showPhrases }) => {
  const visibleCategories = categories.filter(c => c.id !== 'frases' || showPhrases);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex gap-2 px-4 overflow-x-auto" aria-label="Tabs">
        {visibleCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex items-center gap-2 capitalize whitespace-nowrap py-3 px-4 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'border-b-2 border-primary text-primary-dark dark:text-primary-light'
                : 'border-transparent text-subtle hover:text-text dark:hover:text-text-dark hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default CategoryTabs;
