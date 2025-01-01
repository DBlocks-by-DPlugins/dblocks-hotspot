import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		hotspotNumbers,
		hotspotBackgroundColor,
		hotspotTextColor,
		startNumber,
		hotspotFontSize,
	} = attributes;

	return (
		<div {...useBlockProps.save()}>

			{hotspotNumbers.map((focalPoint, index) => (
				<div
					key={index}
					className="drag-point"
					style={{
						left: `${focalPoint.x * 100}%`,
						top: `${focalPoint.y * 100}%`,
						backgroundColor: hotspotBackgroundColor,
						color: hotspotTextColor,
						width: `calc(${hotspotFontSize} * 2)`,
						height: `calc(${hotspotFontSize} * 2)`,
						fontSize: hotspotFontSize,
					}}
				>
					{startNumber + index}
				</div>
			))}

			<InnerBlocks.Content />
		</div>
	);
}
