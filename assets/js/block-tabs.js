/*!
 * ProductBay — Tab Block Frontend Script
 *
 * Lightweight, vanilla-JS tab switcher for the `productbay/tab-product-table` block.
 * Only enqueued when the tab block is present on the page.
 *
 * Keyboard navigation follows the ARIA Authoring Practices Guide (APG) for
 * the "Tabs with Manual Activation" pattern:
 * - Arrow Left / Arrow Right: moves focus between tabs.
 * - Enter / Space: activates the focused tab.
 * - Home / End: jumps to first / last tab.
 *
 * @since 1.1.0
 */
( function () {
	'use strict';
	function initTabBlock( block ) {
		var tabs   = Array.prototype.slice.call( block.querySelectorAll( '[role="tab"]' ) );
		var panels = Array.prototype.slice.call( block.querySelectorAll( '[role="tabpanel"]' ) );
		if ( ! tabs.length ) return;
		function activateTab( index ) {
			tabs.forEach( function ( tab, i ) {
				var isActive = i === index;
				tab.setAttribute( 'aria-selected', isActive ? 'true' : 'false' );
				tab.setAttribute( 'tabindex', isActive ? '0' : '-1' );
				tab.classList.toggle( 'is-active', isActive );
			} );
			panels.forEach( function ( panel, i ) {
				var isActive = i === index;
				panel.classList.toggle( 'is-active', isActive );
				if ( isActive ) {
					panel.removeAttribute( 'hidden' );
				} else {
					panel.setAttribute( 'hidden', '' );
				}
			} );
		}
		tabs.forEach( function ( tab, index ) {
			tab.addEventListener( 'click', function () {
				activateTab( index );
				tab.focus();
			} );
		} );
		tabs.forEach( function ( tab, index ) {
			tab.addEventListener( 'keydown', function ( event ) {
				var key = event.key;
				var newIndex = index;
				if ( key === 'ArrowRight' ) {
					newIndex = ( index + 1 ) % tabs.length;
				} else if ( key === 'ArrowLeft' ) {
					newIndex = ( index - 1 + tabs.length ) % tabs.length;
				} else if ( key === 'Home' ) {
					newIndex = 0;
				} else if ( key === 'End' ) {
					newIndex = tabs.length - 1;
				} else if ( key === 'Enter' || key === ' ' ) {
					activateTab( index );
					return;
				} else {
					return;
				}
				event.preventDefault();
				tabs[ newIndex ].focus();
			} );
		} );
	}
	function init() {
		var blocks = document.querySelectorAll( '.productbay-tabs-block' );
		blocks.forEach( initTabBlock );
	}
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
}() );
