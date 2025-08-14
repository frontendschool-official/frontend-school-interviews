# SearchableDropdown Component

A reusable searchable dropdown component that provides enhanced user experience for selecting options from a list.

## Features

- **Real-time Search**: Filter options as you type
- **Keyboard Navigation**: Support for Escape key to close
- **Customizable Icons**: Add icons to options and trigger button
- **Loading States**: Built-in loading indicator
- **Error Handling**: Display error messages
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Proper ARIA labels and focus management

## Basic Usage

```tsx
import { SearchableDropdown } from '@/components/ui';
import type { SearchableDropdownOption } from '@/components/ui';
import { FiHome } from 'react-icons/fi';

const options: SearchableDropdownOption[] = [
  { id: '1', label: 'Option 1', icon: <FiHome className="w-3 h-3" /> },
  { id: '2', label: 'Option 2', icon: <FiHome className="w-3 h-3" /> },
  { id: '3', label: 'Option 3', icon: <FiHome className="w-3 h-3" /> },
];

const [selectedOption, setSelectedOption] = useState<SearchableDropdownOption | null>(null);

<SearchableDropdown
  options={options}
  value={selectedOption}
  onValueChange={setSelectedOption}
  placeholder="Select an option..."
  searchPlaceholder="Search options..."
  icon={<FiHome className="w-3 h-3 text-primary" />}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SearchableDropdownOption[]` | - | Array of options to display |
| `value` | `SearchableDropdownOption \| null` | - | Currently selected option |
| `onValueChange` | `(option: SearchableDropdownOption \| null) => void` | - | Callback when selection changes |
| `placeholder` | `string` | `'Select an option...'` | Placeholder text when no option is selected |
| `searchPlaceholder` | `string` | `'Search...'` | Placeholder text for search input |
| `loading` | `boolean` | `false` | Show loading state |
| `disabled` | `boolean` | `false` | Disable the dropdown |
| `error` | `string` | - | Error message to display |
| `className` | `string` | `''` | Additional CSS classes |
| `emptyMessage` | `string` | `'No options available'` | Message when no options exist |
| `noResultsMessage` | `string` | `'No results found'` | Message when search has no results |
| `icon` | `React.ReactNode` | - | Icon to display in trigger button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the dropdown |

## SearchableDropdownOption Interface

```tsx
interface SearchableDropdownOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}
```

## Examples

### Company Selection

```tsx
const companies: SearchableDropdownOption[] = companiesData.map(company => ({
  id: company.id,
  label: company.name,
  icon: <FiHome className="w-3 h-3 text-primary" />,
}));

<SearchableDropdown
  options={companies}
  value={selectedCompany}
  onValueChange={setSelectedCompany}
  placeholder="Choose a company"
  searchPlaceholder="Search companies..."
  loading={loading}
  icon={<FiHome className="w-3 h-3 text-primary" />}
  emptyMessage="No companies available"
  noResultsMessage="No companies found"
/>
```

### Role Selection

```tsx
const roles: SearchableDropdownOption[] = [
  { id: 'junior', label: 'Junior (0-2 years)', icon: <FiUser className="w-3 h-3 text-primary" /> },
  { id: 'mid', label: 'Mid-level (3-5 years)', icon: <FiUser className="w-3 h-3 text-primary" /> },
  { id: 'senior', label: 'Senior (6-8 years)', icon: <FiUser className="w-3 h-3 text-primary" /> },
];

<SearchableDropdown
  options={roles}
  value={selectedRole}
  onValueChange={setSelectedRole}
  placeholder="Select your level"
  searchPlaceholder="Search levels..."
  icon={<FiUser className="w-3 h-3 text-primary" />}
/>
```

### Sort Options

```tsx
const sortOptions: SearchableDropdownOption[] = [
  { id: 'date', label: 'Sort by Date', icon: <FiArrowUp className="w-3 h-3 text-primary" /> },
  { id: 'difficulty', label: 'Sort by Difficulty', icon: <FiArrowUp className="w-3 h-3 text-primary" /> },
  { id: 'score', label: 'Sort by Score', icon: <FiArrowUp className="w-3 h-3 text-primary" /> },
];

<SearchableDropdown
  options={sortOptions}
  value={sortBy}
  onValueChange={setSortBy}
  placeholder="Sort by..."
  searchPlaceholder="Search sort options..."
  size="sm"
  icon={<FiArrowUp className="w-3 h-3 text-primary" />}
/>
```

## Migration from HTML Select

### Before (HTML Select)
```tsx
<select
  value={selectedCompany}
  onChange={e => setSelectedCompany(e.target.value)}
  className="w-full px-4 py-2 border border-border rounded-lg"
>
  <option value="">Select a company</option>
  {companies.map(company => (
    <option key={company.id} value={company.id}>
      {company.name}
    </option>
  ))}
</select>
```

### After (SearchableDropdown)
```tsx
const companyOptions: SearchableDropdownOption[] = companies.map(company => ({
  id: company.id,
  label: company.name,
  icon: <FiHome className="w-3 h-3 text-primary" />,
}));

<SearchableDropdown
  options={companyOptions}
  value={selectedCompany}
  onValueChange={setSelectedCompany}
  placeholder="Select a company"
  searchPlaceholder="Search companies..."
  icon={<FiHome className="w-3 h-3 text-primary" />}
/>
```

## Best Practices

1. **Use Icons**: Add relevant icons to make options more recognizable
2. **Descriptive Labels**: Use clear, descriptive labels for options
3. **Loading States**: Show loading state when fetching options
4. **Error Handling**: Display meaningful error messages
5. **Keyboard Support**: Ensure proper keyboard navigation
6. **Responsive Design**: Test on different screen sizes

## Accessibility

The component includes:
- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast support

## Styling

The component uses Tailwind CSS classes and follows the design system:
- Uses design tokens for colors (`primary`, `secondary`, `border`, etc.)
- Responsive sizing (`sm`, `md`, `lg`)
- Consistent spacing and typography
- Dark mode support
