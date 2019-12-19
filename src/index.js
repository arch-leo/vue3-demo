import VNode from "./vnode.js"

class Vue {
	constructor(options) {
		this.$options = options

		this.initProps()
		this.proxy = this.initDataProxy()
		this.initWatch()
		return this.proxy
	}
	$emit(...options) {
		const [name, ...rest] = options
		const cb = this._events[name]
		if (cb) cb(...rest)
	}
	$watch(key, cb) {
		this.dataNotifyChain[key] = this.dataNotifyChain[key] || []
		this.dataNotifyChain[key].push(cb);
	}
	$mount(root) {
		this.$el = root
		// first render
		this._duringFirstRendering = true
		this.update()
		this._duringFirstRendering = false

		const {mounted} = this.$options;
		mounted && mounted.call(this.proxy)
		return this
	}
	createElement(tag, data, children) {
		const components = this.$options.components || {}
		if (tag in components) {
			return new VNode(tag, data, children, components[tag])
		}
		return new VNode(tag, data, children)
	}
	createDom(vnode) {
		if (vnode.componentOptions) {
			const componentInstance = new Vue(Object.assign({}, vnode.componentOptions, {propsData: vnode.data.props}))
			vnode.componentInstance = componentInstance
			componentInstance._events = (vnode.data || {}).on || {}
			componentInstance.$mount()
			return componentInstance.$el
		}
		const el = document.createElement(vnode.tag)
		el.__vue__ = this
		
		const data = vnode.data || {}

		// set dom attributes
		const attrs = data.attrs || {}
		for (let key in attrs) {
			el.setAttribute(key, attrs[key])
		}

		// set className
		const className = data.class
		if (className) {
			el.setAttribute('class', className)
		}

		// set dom event listener
		const events = data.on || {}
		for (let key in events) {
			el.addEventListener(key, events[key])
		}

		if (!Array.isArray(vnode.children)) {
			el.textContent = vnode.children + ''
		} else {
			vnode.children.forEach((child) => {
				if (typeof child === 'string') {
					el.textContent = child
				} else {
					el.appendChild(this.createDom(child))
				}
			})
		}
		return el
	}
	initDataProxy() {
		// https://stackoverflow.com/questions/37714787/can-i-extend-proxy-with-an-es2015-class

		const createDataProxyHandler = path => {
			return {
				set: (obj, key, val) => {
					// console.log('set', key)
					const fullPath = path ? path + '.' + key : key
					const pre = obj[key]
					obj[key] = val
					this.dataNotifyChange(fullPath, pre, val)
					return true
				},
				get: (obj, key) => {
					// console.log('get', key)
					const fullPath = path ? path + '.' + key : key
					// 依赖收集
					this.collect(fullPath)
					if (typeof obj[key] === 'object' && obj[key] !== null) {
						return new Proxy(obj[key], createDataProxyHandler(fullPath))
					} else {
						return obj[key]
					}
				},
				deleteProperty: (obj, key) => {
					// console.log('del', path, obj, key)
					if (key in obj) {
						const fullPath = path ? path + '.' + key : key
						const pre = obj[key]
						delete obj[key]
						this.dataNotifyChange(fullPath, pre)
					}
					return true
				}
			}
		}
		const data = this.$data = this.$options.data ? this.$options.data() : {} // {a: { b: { c: 1 } } }
		const props = this._props;
		const methods = this.$options.methods || {}
		const computed = this.$options.computed || {}

		const handler = {
			set: (_, key, val) => {
				if (key in props) { // first props
					return createDataProxyHandler().set(props, key, val)
				} else if (key in data) { // then data
					return createDataProxyHandler().set(data, key, val)
				} else { // then class property and function
					this[key] = val
				}
				return true
			},
			get: (_, key) => {
				// 优先取data
				if (key in props) { // first props
					return createDataProxyHandler().get(props, key)
				} else if (key in data) { // then data
					return createDataProxyHandler().get(data, key)
				} else if (key in computed) { // then computed
					return computed[key].call(this.proxy)
				} else if (key in methods) { // then methods
					return methods[key].bind(this.proxy)
				} else { // then class property and function
					return this[key]
				}
			}
		}
		return new Proxy(this, handler)
	}
	initProps() {
		this._props = {}
		const {props: propsOptions, propsData} = this.$options;
		if (!propsOptions || !propsOptions.length) return
		propsOptions.forEach((key) => {
			this._props[key] = propsData[key]
		})
	}
	/**
	 * collect: collect dependences on first rendering
	 * @param {string} key ths property path in data. for example, student.name students[0].name
	 */
	collect(key) {
		if (this._duringFirstRendering) {
			this.$watch(key, this.update.bind(this))
		}
	}
	initWatch() {
		this.dataNotifyChain = {}
	}
	dataNotifyChange(key, pre, val) {
		(this.dataNotifyChain[key] || []).forEach(cb => cb(pre, val))
	}
	update(firstRender) {
		const parent = (this.$el || {}).parentElement
		const vnode = this.$options.render.call(this.proxy, this.createElement.bind(this))
		const oldElm = this.$el
		this.$el = this.patch(null, vnode)
		if (parent) {
			parent.replaceChild(this.$el, oldElm)
		}
		// console.log('updated')
	}
	patch(oldVnode, newVnode) {
		return this.createDom(newVnode)
	}
}

export default Vue