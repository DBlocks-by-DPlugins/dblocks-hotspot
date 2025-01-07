import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {

	const { hotspotNumbers, startNumber } = attributes;

	const blockProps = useBlockProps.save();
	const globalStyles = window?.GlobalStylesData || {};

	const defaultStyles = {
		backgroundColor: blockProps.style?.backgroundColor || globalStyles.color?.background,
		color: blockProps.style?.color || globalStyles.color?.text,
		fontSize: blockProps.style?.fontSize || globalStyles.typography?.fontSize,
		borderTopLeftRadius: `${blockProps.style?.borderTopLeftRadius || blockProps.style?.borderRadius || globalStyles.border?.radius?.topLeft || globalStyles.border?.radius || '0px'}`,
		borderTopRightRadius: `${blockProps.style?.borderTopRightRadius || blockProps.style?.borderRadius || globalStyles.border?.radius?.topRight || globalStyles.border?.radius || '0px'}`,
		borderBottomLeftRadius: `${blockProps.style?.borderBottomLeftRadius || blockProps.style?.borderRadius || globalStyles.border?.radius?.bottomLeft || globalStyles.border?.radius || '0px'}`,
		borderBottomRightRadius: `${blockProps.style?.borderBottomRightRadius || blockProps.style?.borderRadius || globalStyles.border?.radius?.bottomRight || globalStyles.border?.radius || '0px'}`,

		borderTop: `${blockProps.style.borderTopWidth || globalStyles.border?.top?.width || '0px'} ${globalStyles.border?.top?.style || 'solid'} ${blockProps.style.borderTopColor || blockProps.style.borderColor || globalStyles.border?.top?.color || 'transparent'}`,
		borderRight: `${blockProps.style.borderRightWidth || globalStyles.border?.right?.width || '0px'} ${globalStyles.border?.right?.style || 'solid'} ${blockProps.style.borderRightColor || blockProps.style.borderColor || globalStyles.border?.right?.color || 'transparent'}`,
		borderBottom: `${blockProps.style.borderBottomWidth || globalStyles.border?.bottom?.width || '0px'} ${globalStyles.border?.bottom?.style || 'solid'} ${blockProps.style.borderBottomColor || blockProps.style.borderColor || globalStyles.border?.bottom?.color || 'transparent'}`,
		borderLeft: `${blockProps.style.borderLeftWidth || globalStyles.border?.left?.width || '0px'} ${globalStyles.border?.left?.style || 'solid'} ${blockProps.style.borderLeftColor || blockProps.style.borderColor || globalStyles.border?.left?.color || 'transparent'}`,
		borderWidth: blockProps.style?.borderWidth || `${globalStyles.border?.top?.width || '0px'} ${globalStyles.border?.right?.width || '0px'} ${globalStyles.border?.bottom?.width || '0px'} ${globalStyles.border?.left?.width || '0px'}`,
	};

	console.log('Merged Styles:', defaultStyles);
	console.log('Block Props:', blockProps);
	console.log('Global Styles:', globalStyles);


	return (
		<div {...blockProps}>

			{hotspotNumbers.map((focalPoint, index) => (
				<div
					key={index}
					className="drag-point"
					style={{
						...defaultStyles,
						left: `${focalPoint.x * 100}%`,
						top: `${focalPoint.y * 100}%`,
						width: `calc(${defaultStyles.fontSize} * 2)`,
						height: `calc(${defaultStyles.fontSize} * 2)`,
					}}
				>
					{startNumber + index}
				</div>
			))}

			<InnerBlocks.Content />
		</div>
	);
}
