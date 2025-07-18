import {
	AnimatedSprite,
	Assets,
	Container,
	Graphics,
	Sprite,
	Text,
} from 'pixi.js';

import { elementType } from '../common/enums.js';

export function debounce(func, delay) {
	let lastCall = 0;
	let lastCallTimer;

	return function perform(...args) {
		const now = Date.now();
		if (lastCall && now - lastCall <= delay) {
			clearTimeout(lastCallTimer);
		}

		lastCall = now;
		lastCallTimer = setTimeout(() => func(...args), delay);
	};
}

// AppInstance
let app = null;

export function setAppInstance(instance) {
	app = instance;
}

export function getAppInstance() {
	if (!app) throw new Error('PIXI app has not been initialized yet');
	return app;
}

// UIFactory
export class UIFactory {
	static createElement(type, config) {
		const creators = {
			[elementType.SPRITE]: this.createSprite,
			[elementType.TEXT]: this.createText,
			[elementType.GRAPHICS]: this.createGraphics,
			[elementType.CONTAINER]: this.createContainer,
			[elementType.ANIMATED_SPRITE]: this.createAnimatedSprite,
		};

		const creator = creators[type] || creators[elementType.CONTAINER];
		return creator(config);
	}

	static createSprite(config) {
		const texture = Assets.cache.get(config.texture);
		return new Sprite(texture);
	}

	static createText({ text, style }) {
		return new Text({
			text: text || '',
			style: style || {},
		});
	}

	static createGraphics({ roundRect, setStrokeStyle, moveTo, lineTo, fill }) {
		const graphics = new Graphics();
		if (roundRect) graphics.roundRect(...roundRect);
		if (setStrokeStyle) graphics.setStrokeStyle(setStrokeStyle);
		if (moveTo) graphics.moveTo(...moveTo);
		if (lineTo) graphics.lineTo(...lineTo);
		if (fill !== undefined) graphics.fill(fill);
		return graphics;
	}

	static createContainer() {
		return new Container();
	}

	static createAnimatedSprite({ texture, animationSpeed }) {
		const sheet = Assets.cache.get(texture);
		const textures = Object.values(sheet.textures);
		const animatedSprite = new AnimatedSprite(textures);

		animatedSprite.animationSpeed = animationSpeed;
		return animatedSprite;
	}
}

export function getAdaptiveSize() {
	const ww = window.innerWidth;
	const wh = window.innerHeight;
	let width, height;

	if (ww >= wh) {
		width = ww;
		height = width / 2;
	} else {
		height = window.innerHeight;
		width = window.innerWidth;
	}
	return { width, height };
}
