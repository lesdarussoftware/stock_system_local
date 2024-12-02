import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Form, Dropdown, DropdownButton } from 'react-bootstrap';

type Option = {
    id: number;
    label: string;
};

type AutocompleteProps = {
    options: Option[];
    onChange?: (selectedOptionId: number) => void;
    placeholder?: string;
};

export function Autocomplete({
    options,
    onChange,
    placeholder = "Buscar...",
}: AutocompleteProps) {

    const [query, setQuery] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() !== '') {
            const filtered = options.filter((option) =>
                option.label.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredOptions(filtered);
            setShowDropdown(filtered.length > 0);
        } else {
            setShowDropdown(false);
        }
    };

    const handleOptionSelect = (option: Option): void => {
        setQuery('');
        setShowDropdown(false);
        if (onChange) onChange(option.id);
    };

    const handleOutsideClick = (e: MouseEvent): void => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
            <Form.Control
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
            />
            {showDropdown && (
                <DropdownButton
                    show
                    title=""
                    id="autocomplete-dropdown"
                    style={{ position: 'absolute', width: '100%', zIndex: 1000 }}
                >
                    {filteredOptions.map((option) => (
                        <Dropdown.Item
                            key={option.id}
                            onClick={() => handleOptionSelect(option)}
                        >
                            {option.label}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            )}
        </div>
    );
}
