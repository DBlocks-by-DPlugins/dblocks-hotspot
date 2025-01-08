import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		hotspotNumbers,
		hotspotBackgroundColor,
		hotspotTextColor,
		startNumber,
		hotspotFontSize,
		defaultStylesBlock
	} = attributes;

	return (
		<div {...useBlockProps.save()}>

			{hotspotNumbers.map((focalPoint, index) => (
				<div
					key={index}
					className="drag-point"
					style={{
						...defaultStylesBlock,
						left: `${focalPoint.x * 100}%`,
						top: `${focalPoint.y * 100}%`,
						width: `calc(${defaultStylesBlock?.fontSize} * 2)`,
						height: `calc(${defaultStylesBlock?.fontSize} * 2)`,
					}}
				>
					{startNumber + index}
				</div>
			))}

			<InnerBlocks.Content />
		</div>
	);
}
