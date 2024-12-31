import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	return (
		<p {...useBlockProps.save()}>
			{'Focal – hello from the saved content!'}
			<InnerBlocks.Content />
		</p>
	);
}
