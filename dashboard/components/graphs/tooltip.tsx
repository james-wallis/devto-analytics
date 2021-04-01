import dayjs from 'dayjs'
import { TooltipProps } from 'recharts'
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'

interface IProps extends TooltipProps<ValueType, NameType> {
    tooltipValuePrefix: string
    dayjsFormat?: string
}

const CustomTooltip = ({
    active,
    payload,
    tooltipValuePrefix,
    dayjsFormat,
}: IProps): JSX.Element | null => {
    if (active && payload && payload.length) {
        const [
            {
                payload: { name, value },
            },
        ] = payload
        const isDate = dayjs(name).isValid()
        return (
            <div className="bg-white p-1 rounded border shadow-sm text-sm">
                <p className="mb-1 font-semibold">
                    {isDate && dayjsFormat ? dayjs(name).format(dayjsFormat) : name}
                </p>
                <p>{`${tooltipValuePrefix}: ${value}`}</p>
            </div>
        )
    }

    return null
}

export default CustomTooltip
