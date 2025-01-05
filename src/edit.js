import { useState, useEffect } from '@wordpress/element';
import { copy, trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks, BlockControls } from '@wordpress/block-editor';
import {
	PanelBody,
	FocalPointPicker,
	Button,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { hotspotNumbers, startNumber } = attributes;

	const [isDragging, setIsDragging] = useState(false);
	const [draggedIndex, setDraggedIndex] = useState(null);
	const [isDraggingDisabled, setIsDraggingDisabled] = useState(false);

	useEffect(() => {
		if (hotspotNumbers.length === 0) {
			setAttributes({ hotspotNumbers: [{ x: 0.5, y: 0.5 }] });
		}
	}, []);

	const addFocalPoint = () => {
		const updatedHotspotNumbers = [...hotspotNumbers, { x: 0.5, y: 0.5 }];
		setAttributes({ hotspotNumbers: updatedHotspotNumbers });
	};

	const updateFocalPoint = (index, newFocalPoint) => {
		setAttributes({
			hotspotNumbers: hotspotNumbers.map((point, i) => (i === index ? newFocalPoint : point)),
		});
	};

	const handleDrag = (index, newFocalPoint) => {
		updateFocalPoint(index, newFocalPoint);
	};

	const handleMouseDown = (index) => {
		setIsDragging(true);
		setDraggedIndex(index);
	};

	const handleMouseMove = (event) => {
		if (isDragging && draggedIndex !== null) {
			const containerRect = event.currentTarget.getBoundingClientRect();
			const relativeX = (event.clientX - containerRect.left) / containerRect.width;
			const relativeY = (event.clientY - containerRect.top) / containerRect.height;

			const focalPoint = {
				x: Math.max(0, Math.min(1, relativeX)),
				y: Math.max(0, Math.min(1, relativeY)),
			};

			updateFocalPoint(draggedIndex, focalPoint);
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
		setDraggedIndex(null);
	};

	const deleteFocalPoint = (index) => {
		const updatedHotspotNumbers = hotspotNumbers.filter((_, i) => i !== index);
		setAttributes({ hotspotNumbers: updatedHotspotNumbers });
	};

	const handleStartNumberChange = (newStartNumber) => {
		const updatedStartNumber = parseInt(newStartNumber, 10) || 1;
		setAttributes({ startNumber: updatedStartNumber });
	};

	// *************************************************************************************
	// Styles
	// *************************************************************************************

	const blockProps = useBlockProps();
	const globalStyles = window?.GlobalStylesData || {};

	const mergedStyles = {
		backgroundColor: blockProps.style?.backgroundColor || globalStyles.color?.background || '#ffffff',
		color: blockProps.style?.color || globalStyles.color?.text || '#000000',
		fontSize: blockProps.style?.fontSize || globalStyles.typography?.fontSize || '16px',
		borderRadius: blockProps.style?.borderRadius || globalStyles.border?.radius || '0px',
		borderColor: blockProps.style?.borderColor || globalStyles.border?.top?.color || '#000000',
		borderWidth: blockProps.style?.borderWidth || globalStyles.border?.top?.width || '1px',
	};

	console.log('Merged Styles:', mergedStyles);
	console.log('Block Props:', blockProps);
	console.log('Global Styles:', globalStyles);

	return (
		<>
			<InspectorControls>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton icon={copy} onClick={addFocalPoint} />
					</ToolbarGroup>
				</BlockControls>
				<PanelBody title={__('Hotspots Positions', 'dblocks-hotspot')}>
					<ToggleControl
						__nextHasNoMarginBottom
						checked={isDraggingDisabled}
						label="Enable Focal Point Preview"
						onChange={() => setIsDraggingDisabled(!isDraggingDisabled)}
					/>
					<div className={`focal-point-picker-container ${isDraggingDisabled ? '' : 'disable-focal-preview'}`}>
						{hotspotNumbers.map((focalPoint, index) => (
							<div className="focal-point-picker-item" key={index}>
								<FocalPointPicker
									value={focalPoint}
									onDragStart={(newFocalPoint) => handleDrag(index, newFocalPoint)}
									onDrag={(newFocalPoint) => handleDrag(index, newFocalPoint)}
									onChange={(newFocalPoint) => handleDrag(index, newFocalPoint)}
								/>
								{hotspotNumbers.length > 1 && (
									<Button variant="secondary" icon={trash} onClick={() => deleteFocalPoint(index)} />
								)}
							</div>
						))}
						<Button variant="primary" onClick={addFocalPoint}>
							Add more
						</Button>
					</div>
				</PanelBody>
				<PanelBody title={__('Hotspots Order', 'dblocks-hotspot')}>
					<NumberControl
						__next40pxDefaultSize
						isShiftStepEnabled={true}
						shiftStep={10}
						label={__('Starting Number', 'dp-hotspot')}
						value={startNumber}
						onChange={handleStartNumberChange}
					/>
				</PanelBody>
			</InspectorControls>
			<div
				{...blockProps}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
			>
				{hotspotNumbers.map((focalPoint, index) => (
					<span
						key={index}
						className="drag-point"
						style={{
							...mergedStyles,
							left: `${focalPoint.x * 100}%`,
							top: `${focalPoint.y * 100}%`,
						}}
						onMouseDown={() => handleMouseDown(index)}
					>
						{startNumber + index}
					</span>
				))}
				<InnerBlocks template={[['core/image']]} />
			</div>
		</>
	);
}