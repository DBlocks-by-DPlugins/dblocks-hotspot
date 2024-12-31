import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import {
	PanelBody,
	FocalPointPicker,
	Button,
	ToggleControl,
	__experimentalNumberControl as NumberControl
} from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes: { hotspotNumbers, startNumber, hotspotBackgroundColor, hotspotTextColor }, setAttributes }) {
	const [focalPoints, setFocalPoints] = useState([{ x: 0.5, y: 0.5 }]);
	const [isDragging, setIsDragging] = useState(false);
	const [draggedIndex, setDraggedIndex] = useState(null);
	const [isDraggingDisabled, setIsDraggingDisabled] = useState(false);

	const addFocalPoint = () => {
		setFocalPoints([...focalPoints, { x: 0.5, y: 0.5 }]);
	};

	const updateFocalPoint = (index, newFocalPoint) => {
		const updatedFocalPoints = [...focalPoints];
		updatedFocalPoints[index] = newFocalPoint;
		setFocalPoints(updatedFocalPoints);
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
		setFocalPoints(focalPoints.filter((_, i) => i !== index));
	};

	const addHotspotNumber = () => {
		const startingNumber = startNumber || 1;
		setAttributes((prevAttributes) => ({
			...prevAttributes,
			hotspotNumbers: [...prevAttributes.hotspotNumbers, {
				id: `${startingNumber + prevAttributes.hotspotNumbers.length}`,
				content: `${startingNumber + prevAttributes.hotspotNumbers.length}`,
				position: { x: 0, y: 0 },
				left: 0,
				top: 0,
			}],
		}));
	};

	const handleStartNumberChange = (newStartNumber) => {
		const updatedStartNumber = parseInt(newStartNumber, 10) || 1;
		setAttributes((prevAttributes) => {
			const updatedHotspotNumbers = prevAttributes.hotspotNumbers.map((hotspot, index) => ({
				...hotspot,
				id: `${updatedStartNumber + index}`,
				content: `${updatedStartNumber + index}`,
			}));
			return {
				...prevAttributes,
				startNumber: updatedStartNumber,
				hotspotNumbers: updatedHotspotNumbers,
			};
		});
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
					<div className={`focal-point-picker-container ${isDraggingDisabled ? '' : 'disable-drag'}`}>
						{focalPoints.map((focalPoint, index) => (
							<div className="focal-point-picker-item" key={index}>
								<FocalPointPicker
									value={focalPoint}
									onDragStart={(newFocalPoint) => updateFocalPoint(index, newFocalPoint)}
									onDrag={(newFocalPoint) => updateFocalPoint(index, newFocalPoint)}
									onChange={(newFocalPoint) => updateFocalPoint(index, newFocalPoint)}
								/>
								{focalPoints.length > 1 && (
									<Button
										variant="secondary"
										size="small"
										onClick={() => deleteFocalPoint(index)}
									>
										Delete
									</Button>
								)}
							</div>
						))}
						<Button
							variant="primary"
							onClick={addFocalPoint}
						>
							Add more
						</Button>
					</div>
				</PanelBody>
				<PanelBody title={__("Hotspot order", "dp-hotspot")}>
					<NumberControl
						__next40pxDefaultSize
						isShiftStepEnabled={true}
						shiftStep={10}
						label={__("Starting Number", "dp-hotspot")}
						value={startNumber || 1}
						onChange={handleStartNumberChange}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps()} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
				{focalPoints.map((focalPoint, index) => (
					<div
						key={index}
						className="drag-point"
						style={{
							left: `${focalPoint.x * 100}%`,
							top: `${focalPoint.y * 100}%`,
							position: 'absolute',
							cursor: 'grab',
						}}
						onMouseDown={() => handleMouseDown(index)}
					>
						{startNumber + index}
					</div>
				))}
				<InnerBlocks
					template={[
						['core/image']
					]}
				/>
			</div>
		</>
	);
}
