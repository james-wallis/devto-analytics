import { ChangeEvent } from 'react';
import ISelectOption from '../interfaces/ISelectOption';

interface IProps {
    options: ISelectOption[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const Select = ({ options, onChange }: IProps) => (
    <select
        onChange={onChange}
        className="
            ml-2 md:ml-4 my-1 p-2 pr-8 relative text-base bg-form-background-color border-form-border-color
            outline-none appearance-none rounded-devto border leading-normal
            bg-down-arrow bg-no-repeat bg-select
            focus:bg-white focus:shadow-form-hover focus:border-form-background-hover
        "
    >
        {
            options.map(({ text, value }) => (
                <option key={value} value={value}>{text}</option>
            ))
        }
    </select>
)

export default Select;
