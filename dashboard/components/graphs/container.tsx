import React from 'react'
import IAzureArticleData from '../../../common/interfaces/IAzureArticleData'
import IAzureFollowerData from '../../../common/interfaces/IAzureFollowerData'
import DailyViewSplitGraph from './dailyViewSplitGraph'

interface IProps {
    azureArticleData: IAzureArticleData
    azureFollowerData: IAzureFollowerData
}

const GraphContainer = ({ azureArticleData, azureFollowerData }: IProps): JSX.Element => {
    console.log(azureArticleData, azureFollowerData)
    return (
        <div className="">
            <DailyViewSplitGraph
                azureArticleData={azureArticleData}
                azureFollowerData={azureFollowerData}
            />
        </div>
    )
}

export default GraphContainer
