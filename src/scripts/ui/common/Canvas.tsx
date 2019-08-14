import React from 'react';

abstract class Canvas<T, U = {}> extends React.Component<T, U> {
	protected isResizing = false;

	public componentDidMount(): void {
		this.setSize();
		this.draw();

		window.addEventListener('resize', this.onResize);
	}

	public componentWillUnmount(): void {
		window.removeEventListener('resize', this.onResize);
	}

	public componentDidUpdate(): void {
		this.draw();
	}

	public abstract draw(): void;

	public abstract setSize(): void;

	private onResize = () => {
		if (this.isResizing) {
			return;
		}
		this.isResizing = true;

		requestAnimationFrame(() => {
			this.setSize();
			this.draw();
			this.isResizing = false;
		});
	}
}

export default Canvas;
