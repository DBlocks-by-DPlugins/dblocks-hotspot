import { useState, useEffect } from '@wordpress/element';
import { Icon, trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks, PanelColorSettings, FontSizePicker, useSetting } from '@wordpress/block-editor';
import {
	PanelBody,
	FocalPointPicker,
	Button,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import './editor.scss';
import { getThemeSupport } from '@wordpress/hooks';

export default function Edit({ attributes, setAttributes }) {
	const {
		hotspotNumbers,
		startNumber,
		hotspotBackgroundColor,
		hotspotTextColor,
		hotspotFontSize,
	} = attributes;

	const [isDragging, setIsDragging] = useState(false);
	const [draggedIndex, setDraggedIndex] = useState(null);
	const [isDraggingDisabled, setIsDraggingDisabled] = useState(false);

	const fontSizes = useSetting('typography.fontSizes'); // gets the font data from theme.json

	const onChangeHotspotBackgroundColor = (color) => {
		setAttributes({ hotspotBackgroundColor: color });
	};

	const onChangeHotspotTextColor = (color) => {
		setAttributes({ hotspotTextColor: color });
	};

	// Sync the focalPoints array with hotspotNumbers in attributes
	useEffect(() => {
		if (hotspotNumbers.length === 0) {
			setAttributes({ hotspotNumbers: [{ x: 0.5, y: 0.5 }] });
		}
	}, []); // Run once when the block is first loaded

	const addFocalPoint = () => {
		const updatedHotspotNumbers = [...hotspotNumbers, { x: 0.5, y: 0.5 }];
		setAttributes({ hotspotNumbers: updatedHotspotNumbers });
	};

	const updateFocalPoint = (index, newFocalPoint) => {
		setAttributes({ hotspotNumbers: hotspotNumbers.map((point, i) => i === index ? newFocalPoint : point) });
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

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Hotspot Settings', 'dblocks-hotspot')}>
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
									<Button
										variant="secondary"
										icon={trash}
										onClick={() => deleteFocalPoint(index)}
									/>
								)}
							</div>
						))}
						<Button variant="primary" onClick={addFocalPoint}>
							Add more
						</Button>
					</div>
				</PanelBody>
				<PanelBody
					className="dblocks-custom"
					title={__('Hotspot Sizes', 'dblocks-sizes')}
				>
					<FontSizePicker
						__next40pxDefaultSize
						fallbackFontSize={parseInt(hotspotFontSize, 10) || 16}
						fontSizes={fontSizes}
						onChange={(newFontSize) => setAttributes({ hotspotFontSize: newFontSize })}
						withSlider
					/>
				</PanelBody>
				<PanelColorSettings

					title={__("Hotspot Colors")}
					colorSettings={[
						{
							value: hotspotBackgroundColor,
							onChange: onChangeHotspotBackgroundColor,
							label: __("Background Color"),
						},
						{
							value: hotspotTextColor,
							onChange: onChangeHotspotTextColor,
							label: __("Text Color"),
						},
					]}
				/>
				<PanelBody title={__('Hotspot Order', 'dp-hotspot')} >

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

			<div {...useBlockProps()} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
				{hotspotNumbers.map((focalPoint, index) => (
					<div
						key={index}
						className="drag-point"
						style={{
							backgroundColor: hotspotBackgroundColor,
							color: hotspotTextColor,
							fontSize: hotspotFontSize,
							left: `${focalPoint.x * 100}%`,
							top: `${focalPoint.y * 100}%`,
							position: 'absolute',
							cursor: 'grab',
							width: `calc(${hotspotFontSize} * 2)`,
							height: `calc(${hotspotFontSize} * 2)`,
						}}
						onMouseDown={() => handleMouseDown(index)}
					>
						{startNumber + index}
					</div>
				))}
				<InnerBlocks template={[['core/image']]} />
			</div>
		</>
	);
}