/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;

const { serialize } = wp.blocks;

const {
	Button,
	Modal,
	TextControl
} = wp.components;

const {
	useSelect,
	useDispatch
} = wp.data;

const { PluginBlockSettingsMenuItem } = wp.editPost;

const { useState } = wp.element;

const { registerPlugin } = wp.plugins;

const BlockPatternBuilder = () => {
	const [ isOpen, setOpen ] = useState( false );
	const [ isLoading, setLoading ] = useState( false );
	const [ title, setTitle ] = useState( '' );

	const content = useSelect( ( select ) => {
		const { getSelectedBlockCount, getSelectedBlock, getMultiSelectedBlocks } = select( 'core/block-editor' );
		const blocks = 1 === getSelectedBlockCount() ? getSelectedBlock() : getMultiSelectedBlocks();

		return serialize( blocks );
	}, [] );

	const { createSuccessNotice } = useDispatch( 'core/notices' );

	const onSave = () => {
		setLoading( true );

		const post = new wp.api.models.Bpb_pattern( {
			title,
			content,
			status: 'publish'
		} );

		post.save().done( () => {
			setLoading( false );
			setOpen( false );
			setTitle( '' );
			createSuccessNotice( __( 'Block Pattern created.' ), {
				type: 'snackbar',
			} );
		} );
	};

	return (
		<>
			<PluginBlockSettingsMenuItem
				label={ __( 'Add to Block Patterns' ) }
				icon={ 'none' } // We don't want an icon, as new UI of Gutenberg does't have icons for Menu Items, but the component doesn't allow that so we pass an icon which doesn't exist.
				onClick={ () => setOpen( true ) }
			/>

			{ isOpen && (
				<Modal
					title={ 'New Pattern' }
					onRequestClose={ () => setOpen( false ) }
				>
					<TextControl
						label={ 'Pattern Title' }
						value={ title }
						onChange={ setTitle }
					/>

					<Button
						isPrimary
						isPressed={ isLoading }
						isBusy={ isLoading }
						onClick={ onSave }
					>
						{ 'Save' }
					</Button>
				</Modal>
			) }
		</>
	);
};

registerPlugin( 'block-pattern-builder', {
	render: BlockPatternBuilder
});