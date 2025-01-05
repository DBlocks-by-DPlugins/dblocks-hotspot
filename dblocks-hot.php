<?php

/**
 * Plugin Name:       DBlocks Hotspot
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dblocks-hotspot
 *
 * @package CreateBlock
 */

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_focal_block_init()
{
    register_block_type(__DIR__ . '/build');
}
add_action('init', 'create_block_focal_block_init');

function global_style_enqueue_editor_assets()
{
    // Fetch global styles
    $global_styles = wp_get_global_styles(['blocks', 'dblocks/hotspot']);

    // Pass global styles data to JavaScript
    wp_enqueue_script(
        'global-style-editor-script',
        plugin_dir_url(__FILE__) . 'build/index.js',
        ['wp-blocks', 'wp-element', 'wp-data', 'wp-block-editor'],
        filemtime(plugin_dir_path(__FILE__) . 'build/index.js'),
        true
    );

    wp_localize_script('global-style-editor-script', 'GlobalStylesData', $global_styles);
}
add_action('enqueue_block_editor_assets', 'global_style_enqueue_editor_assets');
