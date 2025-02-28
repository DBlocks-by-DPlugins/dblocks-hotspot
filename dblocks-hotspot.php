<?php

/**
 * Plugin Name:       DBlocks Hotspot
 * Description:       Create and manage interactive hotspot elements within the block editor.
 * Requires at least: 6.3
 * Requires PHP:      7.2
 * Version:           1.0.2
 * Author:            DPlugins
 * Author URI:        https://dplugins.com/
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
function dblocks_hotspot_register_block()
{
    register_block_type(__DIR__ . '/build', array(
        'category' => 'dblocks'
    ));
}
add_action('init', 'dblocks_hotspot_register_block');



/**
 * Enqueues the global styles for the block editor.
 *
 * This function fetches the global styles specific to the 'dblocks/hotspot' block
 * and enqueues a JavaScript file that will handle these styles in the block editor.
 * The global styles data is localized and made available to the script for use.
 */
function dblocks_hotspot_global_style_enqueue_editor_assets()
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
add_action('enqueue_block_editor_assets', 'dblocks_hotspot_global_style_enqueue_editor_assets');



if (!function_exists('dblocks_block_category')) {
    /**
     * Adds a custom block category to the block editor.
     *
     * This function checks if the 'dblocks_block_category' function exists,
     * and if not, it defines it. The function appends a new category to the
     * block categories array, allowing for better organization of blocks
     * in the block editor.
     *
     * @param array $block_categories The existing block categories.
     * @return array The modified block categories including the new 'DBlocks' category.
     */

    function dblocks_block_category($block_categories)
    {
        $block_categories[] = array(
            'slug' => 'dblocks',
            'title' => 'DBlocks'
        );

        return $block_categories;
    }
}

add_filter('block_categories_all', 'dblocks_block_category');
