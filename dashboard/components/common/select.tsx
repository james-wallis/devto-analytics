import { ChangeEvent } from 'react'
import ISelectOption from '../../interfaces/ISelectOption'

interface IProps {
    options: ISelectOption[]
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
    className?: string
    selected?: string
}

const Select = ({ options, onChange, className = '', selected }: IProps): JSX.Element => (
    <select
        value={selected}
        onChange={onChange}
        className={`
            p-2 pr-8 relative text-base bg-form-background-color border-form-border-color
            outline-none appearance-none rounded-devto border leading-normal
            bg-down-arrow bg-no-repeat bg-select
            focus:bg-white focus:shadow-form-hover focus:border-form-background-hover
            ${className}
        `}
    >
        {options.map(({ text, value }) => (
            <option key={value} value={value}>
                {text}
            </option>
        ))}
    </select>
)

export default Select
