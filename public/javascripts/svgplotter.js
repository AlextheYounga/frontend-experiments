"use strict";
const SVG = opt => {
	let target = null;
	let offset = 0;
	let px = -1;
	let py = -1;
	let iter = 0;
	let cpuTime = 7;
	let polyline = [];
	let init = () => { };
	const polylines = [];
	let matrixTransform = false;
	//calling setup() and draw() from terrain.js
	const autorun = () => {
		if (typeof setup === "function") init = setup;
		init();
		if (typeof draw === "function") render();
	};

	///////////////////////////////////////////////////////////////////////
	const initSVG = opt => {
		if (opt.centerOrigin !== undefined && opt.centerOrigin === true) offset = 95; //Not sure this does anything.				
		if (opt.cpuTime !== undefined) cpuTime = opt.cpuTime;
		const svgElem = document.querySelector("svg");
		svgElem.setAttribute("viewBox", opt.viewBox || "0 0 200 200");
		svgElem.setAttribute("style", `background:${opt.background || "#fff"}`);
		svgElem.setAttribute("viewport-fill", opt.background || "#fff");

		const inside = document.createElementNS("http://www.w3.org/2000/svg", "g");
		inside.setAttribute("stroke-linejoin", "round");
		inside.setAttribute(
			"style",
			`fill:none;stroke:${opt.stroke || "#000"};stroke-width:${opt.strokeWidth ||
			0.2};opacity:${opt.opacity || 1}`
		);
		svgElem.appendChild(inside);
		target = inside;
		const outside = document.createElementNS("http://www.w3.org/2000/svg", "g");
		outside.setAttribute(
			"style",
			`fill:none;stroke:${opt.stroke || "#000"};stroke-width:0.3;`
		);
		svgElem.appendChild(outside);
		requestAnimationFrame(autorun);
		return [svgElem, inside, outside];
	};
	const [svgElem, inside, outside] = initSVG(opt);
	///////////////////////////////////////////////////////////////////////////
	const start = () => {
		matrixTransform = false;
		matrix.data = [1, 0, 0, 1, 0, 0];
		matrix.stack.length = 0;
		polyline = [];
		polylines.length = 0;
		inside.innerHTML = "";
		outside.innerHTML = "";
		init();
		if (typeof draw === "function") render();
	};
	const moveTo = (x0, y0) => {
		let x, y;
		if (Array.isArray(x0)) {
			y = x0[1];
			x = x0[0];
		} else {
			x = x0;
			y = y0;
		}
		if (matrixTransform === true) {
			matrix.transform(x, y);
		} else {
			px = x;
			py = y;
		}
		if (polyline.length > 0) polylineSVG(true);
		polyline.push(px, py);
	};
	const lineTo = (x0, y0) => {
		let x, y;
		if (Array.isArray(x0)) {
			y = x0[1];
			x = x0[0];
		} else {
			x = x0;
			y = y0;
		}
		if (matrixTransform === true) {
			matrix.transform(x, y);
		} else {
			px = x;
			py = y;
		}
		if (py === polyline[polyline.length - 1] && py === polyline[polyline.length - 3]) polyline[polyline.length - 2] = px;
		else if (px === polyline[polyline.length - 2] && px === polyline[polyline.length - 4]) polyline[polyline.length - 1] = py;
		else polyline.push(px, py);
	};
	const line = (x0, y0, x1, y1) => {
		if (x0 !== px || y0 !== py) moveTo(x0, y0);
		lineTo(x1, y1);
	};
	const rect = (x0, y0, w0, h0) => {
		moveTo(x0, y0);
		lineTo(x0 + w0, y0);
		lineTo(x0 + w0, y0 + h0);
		lineTo(x0, y0 + h0);
		lineTo(x0, y0);
	};
	const fillRect = (x0, y0, w0, h0) => {
		const s = opt.strokeWidth || 0.2;
		for (let x = x0; x <= x0 + w0; x += s) {
			moveTo(x, y0);
			lineTo(x, y0 + h0);
		}
	};
	const quadraticCurveTo = (cx, cy, x1, y1, steps = 20) => {
		const s = 1 / steps;
		const x0 = px;
		const y0 = py;
		for (let t = 0; t < 1; t += s) {
			lineTo(
				(1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1,
				(1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1
			);
		}
		lineTo(x1, y1);
	};
	const ellipse = (x, y, w, h = w, start = 0, end = 2 * Math.PI) => {
		const steps = Math.PI / 36;
		moveTo(x + Math.cos(start) * w * 0.5, y);
		for (let a = start + steps; a <= end; a += steps) {
			lineTo(x + Math.cos(a) * w * 0.5, y - Math.sin(a) * h * 0.5);
		}
	};
	const canvas = (w, h) => {
		const canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		return canvas;
	};

	////////////////////////////////////////////////////////////////
	// https://turtletoy.net/turtle/25b7bc4d43
	// Reinder's occlusion code parts from "Cubic space division #2"
	////////////////////////////////////////////////////////////////
	const Polygons = class {
		constructor() {
			this.list = [];
		}
		draw(p) {
			let vis = true;
			for (const p1 of this.list) {
				// AABB overlapping test - still O(N2) but very fast
				if (
					Math.abs(p1.aabb[0] - p.aabb[0]) - (p.aabb[2] + p1.aabb[2]) < 0 &&
					Math.abs(p1.aabb[1] - p.aabb[1]) - (p.aabb[3] + p1.aabb[3]) < 0
				) {
					if (p.boolean(p1) === false) {
						vis = false;
						break;
					}
				}
			}
			if (vis === true) {
				p.draw();
				this.list.push(p);
			}
		}
		create() {
			return new Polygon();
		}
		clear() {
			this.list.length = 0;
		}
	};
	const Polygon = class {
		constructor() {
			this.cp = [];
			this.dp = [];
			this.aabb = [];
		}
		addPoints(...points) {
			for (let i = 0; i < points.length; i++) this.cp.push(points[i]);
			this.aabb = this.AABB();
		}
		addOutline(s = 0, e = this.cp.length) {
			const len = this.cp.length;
			for (let i = s; i < e; i++) {
				this.dp.push(this.cp[i], this.cp[(i + 1) % len]);
			}
		}
		draw() {
			if (this.dp.length === 0) return;
			for (let i = 0, l = this.dp.length; i < l; i += 2) {
				const d0 = this.dp[i];
				const d1 = this.dp[i + 1];
				moveTo(d0[0], d0[1]);
				lineTo(d1[0], d1[1]);
			}
		}
		AABB() {
			let xmin = 2000;
			let xmax = -2000;
			let ymin = 2000;
			let ymax = -2000;
			for (const cp of this.cp) {
				const x = cp[0];
				const y = cp[1];
				if (x < xmin) xmin = x;
				if (x > xmax) xmax = x;
				if (y < ymin) ymin = y;
				if (y > ymax) ymax = y;
			}
			return [
				(xmin + xmax) * 0.5,
				(ymin + ymax) * 0.5,
				(xmax - xmin) * 0.5,
				(ymax - ymin) * 0.5
			];
		}
		addHatching(a, d) {
			const tp = new Polygon();
			const x = this.aabb[0],
				y = this.aabb[1];
			const w = this.aabb[2],
				h = this.aabb[3];
			const l = Math.sqrt((w * 2) ** 2 + (h * 2) ** 2) * 0.5;
			tp.cp.push([x - w, y - h], [x + w, y - h], [x + w, y + h], [x - w, y + h]);
			const cx = Math.sin(a) * l,
				cy = Math.cos(a) * l;
			let px = x - Math.cos(a) * l;
			let py = y - Math.sin(a) * l;
			for (let i = 0; i < l * 2; i += d) {
				tp.dp.push([px + cx, py - cy], [px - cx, py + cy]);
				px += Math.cos(a) * d;
				py += Math.sin(a) * d;
			}
			tp.boolean(this, 1);
			for (const dp of tp.dp) this.dp.push(dp);
		}
		inside(p) {
			let int = 0;
			const px = p[0];
			const py = p[1];
			for (let i = 0, l = this.cp.length; i < l; i++) {
				if ((px - this.cp[i][0]) ** 2 + (py - this.cp[i][1]) ** 2 <= 0.01) return 0;
				if (
					Polygon.intersect(
						[],
						p,
						[0.1, -1000],
						this.cp[i],
						this.cp[(i + 1) % l]
					) === true
				)
					int++;
			}
			return int & 1;
		}
		boolean(p, diff = 0) {
			const ndp = [],
				pint = [0, 0];
			for (let i = 0, l = this.dp.length; i < l; i += 2) {
				const ls0 = this.dp[i];
				const ls1 = this.dp[i + 1];
				const int = [];
				for (let j = 0, cl = p.cp.length; j < cl; j++) {
					if (
						Polygon.intersect(pint, ls0, ls1, p.cp[j], p.cp[(j + 1) % cl]) === true
					)
						int.push([pint[0], pint[1]]);
				}
				if (int.length === 0) {
					if (diff === p.inside(ls0)) ndp.push(ls0, ls1);
				} else {
					int.push(ls0, ls1);
					const cx = ls1[0] - ls0[0];
					const cy = ls1[1] - ls0[1];
					for (let i = 0, len = int.length; i < len; i++) {
						let j = i;
						const item = int[j];
						for (
							const db = (item[0] - ls0[0]) * cx + (item[1] - ls0[1]) * cy;
							j > 0 &&
							(int[j - 1][0] - ls0[0]) * cx + (int[j - 1][1] - ls0[1]) * cy < db;
							j--
						)	int[j] = int[j - 1];
						int[j] = item;
					}
					for (let j = 0; j < int.length - 1; j++) {
						if (
							(int[j][0] - int[j + 1][0]) ** 2 + (int[j][1] - int[j + 1][1]) ** 2 >=
							0.01
						) {
							if (
								diff ===
								p.inside([
									(int[j][0] + int[j + 1][0]) / 2,
									(int[j][1] + int[j + 1][1]) / 2
								])
							) ndp.push(int[j], int[j + 1]);
						}
					}
				}
			}
			this.dp = ndp;
			return this.dp.length > 0;
		}
		// port of http://paulbourke.net/geometry/pointlineplane/Helpers.cs
		static intersect(pint, a, b, c, d) {
			const e = (d[1] - c[1]) * (b[0] - a[0]) - (d[0] - c[0]) * (b[1] - a[1]);
			if (e === 0) return false;
			const ua = ((d[0] - c[0]) * (a[1] - c[1]) - (d[1] - c[1]) * (a[0] - c[0])) / e;
			const ub = ((b[0] - a[0]) * (a[1] - c[1]) - (b[1] - a[1]) * (a[0] - c[0])) / e;
			if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
				pint[0] = a[0] + ua * (b[0] - a[0]);
				pint[1] = a[1] + ua * (b[1] - a[1]);
				return true;
			}
			return false;
		}
	};
	/////////////////////////////////////////////////////////////////////////////
	// adapted from https://turtletoy.net/js/turtlesvg.js
	const clip = (polyline, left, size) => {
		let pint = [0, 0];
		const clip = [left, left, left, size, size, size, size, left, left, left];
		const nps = [];
		let np = [];
		let pcx = polyline[0];
		let pcy = polyline[1];
		let inside = pcx > left && pcx < size && pcy > left && pcy < size;
		if (inside === true) np.push(pcx, pcy);
		for (let j = 0; j < polyline.length; j += 2) {
			const cx = polyline[j];
			const cy = polyline[j + 1];
			if (cx === pcx && cy === pcy && j < polyline.length - 2) continue;
			if (cx > left && cx < size && cy > left && cy < size) {
				if (inside) np.push(cx, cy);
				else {
					for (let i = 0; i < 8; i += 2) {
						if (
							Polygon.intersect(
								pint,
								[pcx, pcy],
								[cx, cy],
								[clip[i], clip[i + 1]],
								[clip[i + 2], clip[i + 3]]
							) === true
						) break;
					}
					np.push(pint[0], pint[1], cx, cy);
				}
				inside = true;
			} else {
				if (inside) {
					for (let i = 0; i < 8; i += 2) {
						if (
							Polygon.intersect(
								pint,
								[pcx, pcy],
								[cx, cy],
								[clip[i], clip[i + 1]],
								[clip[i + 2], clip[i + 3]]
							) === true
						) break;
					}
					np.push(pint[0], pint[1]);
					nps.push(np);
					np = [];
				} else {
					const ips = [];
					for (let i = 0; i < 8; i += 2) {
						if (
							Polygon.intersect(
								pint,
								[pcx, pcy],
								[cx, cy],
								[clip[i], clip[i + 1]],
								[clip[i + 2], clip[i + 3]]
							) === true
						) ips.push(pint[0], pint[1]);
					}
					if (ips.length === 4) nps.push(ips);
				}
				inside = false;
			}
			pcx = cx;
			pcy = cy;
		}
		if (np.length > 0) nps.push(np);
		return nps;
	};
	const polylineSVG = (reduce = false) => {
		if (polyline.length <= 2) {
			polyline = [];
			return;
		}
		const points = reduce ? polyline.map(n => n * 0.95 + offset + 5) : polyline;
		const clippedPaths = target === inside ? clip(points, 5, 195) : [points];
		for (const points of clippedPaths) {
			const poly = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"polyline"
			);
			const svgPoints = points.map(n => +n.toFixed(2));
			poly.setAttribute("points", svgPoints.toString());
			target.appendChild(poly);
			if (target === inside) polylines.push(points);
		}
		polyline = [];
	};
	const render = () => {
		const start = performance.now();
		let run;
		do {
			run = draw(iter++);
		} while (run === true && performance.now() - start < cpuTime);
		if (run === true) requestAnimationFrame(render);
		else {
			moveTo(px, py);
			iter = 0;
			matrixTransform = false;
			target = outside;
			target.innerHTML = "";
			polyline = [];
		}
	};
	//////////////////////////////////////////////////////
	const ContextFree = class {
		constructor() {
			this.minSize = 0.02;
			this.polygons = null;
			this.polygon = {};
			this.polygon.rect = (m, a = 0, s = 0) => this.polyRect(m, a, s);
			this.init();
		}
		init() {
			this.shapes = [];
			this.zoom = 1;
			this.ox = 0;
			this.oy = 0;
			this.box = [0, 0, 0, 0];
			if (this.polygons !== null) this.polygons.clear();
		}
		matrix() {
			return new Mat2D([1, 0, 0, -1, 0, 0]);
		}
		boundingBox(m) {
			const p0 = this.transform(0, 0, m.m);
			const p1 = this.transform(0.5, 0, m.m);
			const p2 = this.transform(0.5, 0.5, m.m);
			const p3 = this.transform(0, 0.5, m.m);
			const minx = Math.min(p0[0], p1[0], p2[0], p3[0]);
			const maxx = Math.max(p0[0], p1[0], p2[0], p3[0]);
			const miny = Math.min(p0[1], p1[1], p2[1], p3[1]);
			const maxy = Math.max(p0[1], p1[1], p2[1], p3[1]);
			if (minx < this.box[0]) this.box[0] = minx;
			else if (maxx > this.box[2]) this.box[2] = maxx;
			if (miny < this.box[1]) this.box[1] = miny;
			else if (maxy > this.box[3]) this.box[3] = maxy;
		}
		fillCircle(m) {
			this.boundingBox(m);
			m.type = 0;
			this.shapes.push(m);
		}
		circle(m) {
			this.boundingBox(m);
			m.type = 4;
			this.shapes.push(m);
		}
		fillRect(m) {
			this.boundingBox(m);
			m.type = 2;
			this.shapes.push(m);
		}
		rect(m) {
			this.boundingBox(m);
			m.type = 1;
			this.shapes.push(m);
		}
		line(m) {
			this.boundingBox(m);
			m.type = 3;
			this.shapes.push(m);
		}
		polyRect(m, a = 0, s = 0) {
			this.boundingBox(m);
			m.type = 11;
			m.a = a;
			m.s = s;
			this.shapes.push(m);
		}
		draw(shape) {
			let d, s;
			switch (shape.type) {
				case 0:
					// fillCircle
					s = 0.2 / shape.size();
					moveTo(this.transform(0.5, 0, shape.m));
					d = 1;
					for (let a = 0; a < Math.PI; a += s) {
						lineTo(this.transform(0.5 * Math.cos(a) * d, 0.5 * Math.sin(a) * d, shape.m));
						lineTo(this.transform(-0.5 * Math.cos(a) * d, -0.5 * Math.sin(a) * d, shape.m));
						d = -d;
					}
					break;
				case 1:
					// strokeRect
					moveTo(this.transform(-0.5, -0.5, shape.m));
					lineTo(this.transform(0.5, -0.5, shape.m));
					lineTo(this.transform(0.5, 0.5, shape.m));
					lineTo(this.transform(-0.5, 0.5, shape.m));
					lineTo(this.transform(-0.5, -0.5, shape.m));
					break;
				case 2:
					// fillRect
					moveTo(this.transform(-0.5, -0.5, shape.m));
					d = 1;
					s = 0.08 / shape.size();
					for (let y = -0.5; y <= 0.5; y += s) {
						lineTo(this.transform(-0.5 * d, y, shape.m));
						lineTo(this.transform(0.5 * d, y, shape.m));
						d = -d;
					}
					break;
				case 3:
					// line
					moveTo(this.transform(-0.5, 0, shape.m));
					lineTo(this.transform(0.5, 0, shape.m));
					break;
				case 4:
					// circle
					s = 0.1 / shape.size();
					moveTo(this.transform(0.5, 0, shape.m));
					for (let a = 0; a < 2 * Math.PI + s; a += s) {
						lineTo(this.transform(0.5 * Math.cos(a), 0.5 * Math.sin(a), shape.m));
					}
					break;
				case 11:
					// polygon rectangle
					if (this.polygons === null) this.polygons = new Polygons();
					const p = this.polygons.create();
					const p0 = this.transform(-0.5, -0.5, shape.m);
					const p1 = this.transform(0.5, -0.5, shape.m);
					const p2 = this.transform(0.5, 0.5, shape.m);
					const p3 = this.transform(-0.5, 0.5, shape.m);
					p.addPoints(p0, p1, p2, p3);
					p.addOutline(0);
					if (shape.s !== 0) {
						if (shape.a === -1) {
							shape.a = Math.atan2(p1[1] - p2[1], p1[0] - p2[0]);
						}
						p.addHatching(shape.a, shape.s);
					}
					this.polygons.draw(p);
					break;
			}
		}
		scale(margin = 0.95) {
			this.zoom = Math.min(
				margin * 200 / (this.box[2] - this.box[0]),
				margin * 200 / (this.box[3] - this.box[1])
			);
			this.ox = (this.box[0] + this.box[2]) * 0.5 * this.zoom;
			this.oy = (this.box[3] + this.box[1]) * 0.5 * this.zoom;
		}
		transform(x, y, m) {
			const m0 = m[0] * this.zoom;
			const m1 = m[1] * this.zoom;
			const m2 = m[2] * this.zoom;
			const m3 = m[3] * this.zoom;
			const m4 = m[4] * this.zoom - this.ox;
			const m5 = m[5] * this.zoom - this.oy;
			return [
				m0 * x + m2 * y + m4,
				m1 * x + m3 * y + m5
			];
		}
	};
	const Mat2D = class {
		constructor(m) {
			this.m = m;
			this.type = 0;
			this.a = 0;
			this.s = 0;
		}
		rotate(v) {
			const rad = Math.PI * v / 180;
			const cos = Math.cos(rad);
			const sin = Math.sin(rad);
			return new Mat2D([
				cos * this.m[0] + sin * this.m[2],
				cos * this.m[1] + sin * this.m[3],
				cos * this.m[2] - sin * this.m[0],
				cos * this.m[3] - sin * this.m[1],
				this.m[4],
				this.m[5]
			]);
		}
		translate(x, y = 0) {
			return new Mat2D([
				this.m[0],
				this.m[1],
				this.m[2],
				this.m[3],
				this.m[4] + x * this.m[0] + y * this.m[2],
				this.m[5] + x * this.m[1] + y * this.m[3]
			]);
		}
		scale(x = 1, y = x) {
			return new Mat2D([
				this.m[0] * x,
				this.m[1] * x,
				this.m[2] * y,
				this.m[3] * y,
				this.m[4],
				this.m[5]
			]);
		}
		flip(v) {
			const rad = Math.PI * v / 180;
			const x = Math.cos(rad);
			const y = Math.sin(rad);
			const n = 1 / (x * x + y * y);
			const b00 = (x * x - y * y) / n;
			const b01 = 2 * x * y / n;
			const b10 = 2 * x * y / n;
			const b11 = (y * y - x * x) / n;
			return new Mat2D([
				b00 * this.m[0] + b01 * this.m[2],
				b00 * this.m[1] + b01 * this.m[3],
				b10 * this.m[0] + b11 * this.m[2],
				b10 * this.m[1] + b11 * this.m[3],
				this.m[4],
				this.m[5]
			]);
		}
		size() {
			const x = this.m[0] * this.m[0] + this.m[1] * this.m[1];
			const y = this.m[2] * this.m[2] + this.m[3] * this.m[3];
			return Math.sqrt(Math.max(x, y));
		}
	};
	///////////////////////////////////////////////////////////////////////////
	const matrix = {
		data: [1, 0, 0, 1, 0, 0],
		stack: [],
		transform(x, y) {
			const m = this.data;
			px = m[0] * x + m[2] * y + m[4];
			py = m[1] * x + m[3] * y + m[5];
		},
		rotate(v) {
			const m = this.data;
			matrixTransform = true;
			const cos = Math.cos(v);
			const sin = Math.sin(v);
			const r00 = cos * m[0] + sin * m[2];
			const r01 = cos * m[1] + sin * m[3];
			m[2] = cos * m[2] - sin * m[0];
			m[3] = cos * m[3] - sin * m[1];
			m[0] = r00;
			m[1] = r01;
			return this;
		},
		translate(x, y = 0) {
			const m = this.data;
			matrixTransform = true;
			m[4] += x * m[0] + y * m[2];
			m[5] += x * m[1] + y * m[3];
			return this;
		},
		scale(x = 1, y = x) {
			const m = this.data;
			matrixTransform = true;
			m[0] *= x;
			m[1] *= x;
			m[2] *= y;
			m[3] *= y;
			return this;
		},
		push() {
			const m = this.data;
			this.stack.push([m[0], m[1], m[2], m[3], m[4], m[5]]);
			return this;
		},
		pop() {
			this.data = this.stack.pop();
			return this;
		}
	};
	//////////////////////////////////////////////////////
	// http://mrl.nyu.edu/~perlin/noise/
	const Perlin = class {
		constructor(setup) {
			this.p = new Uint8Array(512);
			this.octaves = setup.octaves || 1;
			this.init();
		}
		init() {
			const p = new Uint8Array(256);
			for (let i = 0; i < 256; i++) p[i] = i;
			for (let i = 255; i > 0; i--) {
				const n = Math.floor((i + 1) * Math.random());
				const q = p[i];
				p[i] = p[n];
				p[n] = q;
			}
			for (let i = 0; i < 512; i++) {
				this.p[i] = p[i & 255];
			}
		}
		lerp(t, a, b) {
			return a + t * (b - a);
		}
		grad2d(i, x, y) {
			const v = (i & 1) === 0 ? x : y;
			return (i & 2) === 0 ? -v : v;
		}
		noise2d(x2d, y2d) {
			const X = Math.floor(x2d) & 255;
			const Y = Math.floor(y2d) & 255;
			const x = x2d - Math.floor(x2d);
			const y = y2d - Math.floor(y2d);
			const fx = (3 - 2 * x) * x * x;
			const fy = (3 - 2 * y) * y * y;
			const p0 = this.p[X] + Y;
			const p1 = this.p[X + 1] + Y;
			return this.lerp(
				fy,
				this.lerp(
					fx,
					this.grad2d(this.p[p0], x, y),
					this.grad2d(this.p[p1], x - 1, y)
				),
				this.lerp(
					fx,
					this.grad2d(this.p[p0 + 1], x, y - 1),
					this.grad2d(this.p[p1 + 1], x - 1, y - 1)
				)
			);
		}
		noise(x, y) {
			let e = 1,
				k = 1,
				s = 0;
			for (let i = 0; i < this.octaves; ++i) {
				e *= 0.5;
				s += e * (1 + this.noise2d(k * x, k * y)) / 2;
				k *= 2;
			}
			return s;
		}
	};
	// https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.js
	const Simplex = class {
		constructor(setup) {
			this.octaves = setup.octaves || 1;
			this.F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
			this.G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
			this.p = new Uint8Array(256);
			this.grad3 = new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1]);
			this.init();
		}
		init() {
			for (let i = 0; i < 256; i++) this.p[i] = i;
			for (let i = 0; i < 255; i++) {
				const r = i + ~~(Math.random() * (256 - i));
				const aux = this.p[i];
				this.p[i] = this.p[r];
				this.p[r] = aux;
			}
			this.perm = new Uint8Array(512);
			this.permMod12 = new Uint8Array(512);
			for (let i = 0; i < 512; i++) {
				this.perm[i] = this.p[i & 255];
				this.permMod12[i] = this.perm[i] % 12;
			}
		}
		noise2D(xin, yin) {
			let n0 = 0,
				n1 = 0,
				n2 = 0;
			const s = (xin + yin) * this.F2;
			const i = Math.floor(xin + s);
			const j = Math.floor(yin + s);
			const t = (i + j) * this.G2;
			const X0 = i - t;
			const Y0 = j - t;
			let x0 = xin - X0;
			let y0 = yin - Y0;
			const i1 = x0 > y0 ? 1 : 0;
			const j1 = x0 > y0 ? 0 : 1;
			const x1 = x0 - i1 + this.G2;
			const y1 = y0 - j1 + this.G2;
			const x2 = x0 - 1.0 + 2.0 * this.G2;
			const y2 = y0 - 1.0 + 2.0 * this.G2;
			const ii = i & 255;
			const jj = j & 255;
			let t0 = 0.5 - x0 * x0 - y0 * y0;
			if (t0 >= 0) {
				const gi0 = this.permMod12[ii + this.perm[jj]] * 3;
				t0 *= t0;
				n0 = t0 * t0 * (this.grad3[gi0] * x0 + this.grad3[gi0 + 1] * y0);
			}
			let t1 = 0.5 - x1 * x1 - y1 * y1;
			if (t1 >= 0) {
				const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]] * 3;
				t1 *= t1;
				n1 = t1 * t1 * (this.grad3[gi1] * x1 + this.grad3[gi1 + 1] * y1);
			}
			let t2 = 0.5 - x2 * x2 - y2 * y2;
			if (t2 >= 0) {
				const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]] * 3;
				t2 *= t2;
				n2 = t2 * t2 * (this.grad3[gi2] * x2 + this.grad3[gi2 + 1] * y2);
			}
			return 70.0 * (n0 + n1 + n2);
		}
		noise(x, y) {
			let e = 1,
				k = 1,
				s = 0;
			for (let i = 0; i < this.octaves; ++i) {
				e *= 0.5;
				s += e * (1 + this.noise2D(k * x, k * y)) / 2;
				k *= 2;
			}
			return s;
		}
	};

	//////////////////////////////////////////////////////
	const imageData = (img, width = 0, height = 0) => {
		if (typeof img === "string") img = document.getElementById(img);
		const canvas = document.createElement("canvas");
		const w = (canvas.width = width || img.width);
		const h = (canvas.height = height || img.height);
		const ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, w, h);
		return ctx.getImageData(0, 0, w, h);
	};

	/////////////////////////////////////////////////
	return {
		simplex(opt) {
			return new Simplex(opt || {});
		},
		perlin(opt) {
			return new Perlin(opt || {});
		},
		getX() {
			return px;
		},
		getY() {
			return py;
		},
		moveTo: moveTo,
		lineTo: lineTo,
		quadraticCurveTo: quadraticCurveTo,
		ellipse: ellipse,
		circle(x, y, w) {
			ellipse(x, y, w, w, 0, 2 * Math.PI);
		},
		arc(x, y, w, s, e) {
			ellipse(x, y, w, w, s, e);
		},
		fillRect(x0, y0, w0, h0 = w0) {
			fillRect(x0, y0, w0, h0);
		},
		rect(x0, y0, w0, h0 = w0) {
			rect(x0, y0, w0, h0);
		},
		line(x0, y0, x1, y1) {
			if (Array.isArray(x0)) {
				if (Array.isArray(y0)) line(x0[0], x0[1], y0[0], y0[1]);
				else line(x0[0], x0[1], y0, x1);
			} else line(x0, y0, x1, y1);
		},
		polygons() {
			return new Polygons();
		},
		start: start,
		run: start,
		matrix: matrix,
		imageData: imageData,
		canvas: canvas,
		contextFree() {
			return new ContextFree();
		}
	};
};
