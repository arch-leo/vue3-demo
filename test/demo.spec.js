import Vue from "../src/index.js";

describe('Demo', function () {
	it('Basic', function () {
		const vm = new Vue({
			data() {
				return {
					a: 0,
				}
			},
			render(h) {
				return h('button', {
					on: {
						'click': this.handleClick
					}
				}, '点击按钮 - ' + this.a)
			},
			methods: {
				handleClick() {
					this.a++
				}
			}
		}).$mount()
		document.body.appendChild(vm.$el)
	});
});