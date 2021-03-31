import React from 'react'
import IAzureArticleData from '../../../common/interfaces/IAzureArticleData'
import IAzureFollowerData from '../../../common/interfaces/IAzureFollowerData'

interface IProps {
    azureArticleData: IAzureArticleData
    azureFollowerData: IAzureFollowerData
}

const GraphContainer = ({ azureArticleData, azureFollowerData }: IProps): JSX.Element => {
    console.log(azureArticleData, azureFollowerData)
    return <div className=""></div>
}

export default GraphContainer
