import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		hotspotNumbers,
		hotspotBackgroundColor,
		hotspotTextColor,
		startNumber,
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
						color: hotspotTextColor
					}}
				>
					{startNumber + index}
				</div>
			))}

			<InnerBlocks.Content />
		</div>
	);
}
