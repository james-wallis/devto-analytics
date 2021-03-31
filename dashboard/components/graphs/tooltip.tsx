import { TooltipProps } from 'recharts'
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'

interface IProps extends TooltipProps<ValueType, NameType> {
    tooltipValuePrefix: string
}

const CustomTooltip = ({ active, payload, tooltipValuePrefix }: IProps): JSX.Element | null => {
    if (active && payload && payload.length) {
        const [{ name, value }] = payload
        return (
            <div className="bg-white p-1 rounded border shadow-sm text-sm">
                <p className="mb-1 font-semibold">{name}</p>
                <p>{`${tooltipValuePrefix}: ${value}`}</p>
            </div>
        )
    }

    return null
}

export default CustomTooltip
