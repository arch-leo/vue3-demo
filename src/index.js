import VNode from "./vnode.js"

class Vue {
	constructor(options) {
		this.$options = options

		this.proxy = this.initDataProxy()
		this.initWatch()
		return this.proxy
	}
	$watch(key, cb) {
		this.dataNotifyChain[key] = this.dataNotifyChain[key] || []
		this.dataNotifyChain[key].push(cb);
	}
	$mount(root) {
		const {mounted, render} = this.$options;
		const vnode = render.call(this.proxy, this.createElement)
		this.$el = this.creatElm(vnode)
		if (root) {
			const parent = root.parentElement
			parent.removeChild(root)
			parent.appendChild(this.$el)
		}
		mounted && mounted.call(this.proxy)
		return this
	}
	createElement(tag, data, children) {
		return new VNode(tag, data, children)
	}
	creatElm(vnode) {
		const el = document.createElement(vnode.tag)
		el.__vue__ = this
		for (let key in vnode.data) {
			el.setAttribute(key, vnode.data[key])
		}
		const events = (vnode.data || {}).on || {}
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
					el.appendChild(this.creatElm(child))
				}
			})
		}
		return el
	}
	initDataProxy() {
		const data = this.$data = this.$options.data ? this.$options.data() : {}

		// https://stackoverflow.com/questions/37714787/can-i-extend-proxy-with-an-es2015-class
		return new Proxy(this, {
			set: (_, key, value) => {
				if (key in data) { // 优先设置data
					const pre = data[key]
					if (pre !== value) {
						data[key] = value
						this.dataNotifyChange(key, pre, value)
					}
				} else {
					this[key] = value
				}
				return true
			},
			get: (_, key) => {
				const methods = this.$options.methods || {}
				if (key in data) {
					if (!this.collected) {
						this.$watch(key, this.update.bind(this)) // 依赖收集
						this.collected = true
					}
					return data[key] // 优先取data
				}
				if (key in methods) return methods[key].bind(this.proxy)
				return this[key]
			}
		})
	}
	initWatch() {
		this.dataNotifyChain = {}
	}
	dataNotifyChange(key, pre, val) {
		(this.dataNotifyChain[key] || []).forEach(cb => cb(pre, val))
	}
	update() {
		const parent = this.$el.parentElement
		if (parent) {
			parent.removeChild(this.$el)
		}
		const vnode = this.$options.render.call(this.proxy, this.createElement)
		this.$el = this.patch(null, vnode)
		if (parent) {
			parent.appendChild(this.$el)
		}
		console.log('updated')
	}
	patch(oldVnode, newVnode) {
		return this.creatElm(newVnode)
	}
}

export default Vue