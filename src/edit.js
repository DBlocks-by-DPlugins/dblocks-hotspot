import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, FocalPointPicker, Button } from '@wordpress/components';
import './editor.scss';

export default function Edit() {
	const [focalPoints, setFocalPoints] = useState([{ x: 0.5, y: 0.5 }]);
	const [isDragging, setIsDragging] = useState(false);
	const [draggedIndex, setDraggedIndex] = useState(null);

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
			const { clientX, clientY } = event;
			const focalPoint = {
				x: clientX / window.innerWidth,
				y: clientY / window.innerHeight,
			};
			updateFocalPoint(draggedIndex, focalPoint);
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
		setDraggedIndex(null);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'focal')}>
					<div className="focal-point-picker-container">
						{focalPoints.map((focalPoint, index) => (
							<FocalPointPicker
								key={index}
								value={focalPoint}
								onDragStart={(newFocalPoint) => updateFocalPoint(index, newFocalPoint)}
								onDrag={(newFocalPoint) => updateFocalPoint(index, newFocalPoint)}
								onChange={(newFocalPoint) => updateFocalPoint(index, newFocalPoint)}
							/>
						))}
						{focalPoints.length > 1 && (
							<Button
								variant="secondary"
								size="small"
								onClick={() => setFocalPoints(focalPoints.slice(0, -1))}
							>
								Delete
							</Button>
						)}
					</div>
					<Button
						variant="primary"
						size="small"
						onClick={addFocalPoint}
					>
						Add more
					</Button>
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
					></div>
				))}
			</div>
		</>
	);
}
