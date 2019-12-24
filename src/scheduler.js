import { nextTick } from './util'

const queue = []
let has = {}
export function queueWatcher(watcher) {
	const id = watcher.id
	if (!has[id]) {
		has[id] = true
		queue.push(watcher)
		nextTick(flushSchedulerQueue)
	}
}


/**
 * flush both queues and run the wathers
 */
function flushSchedulerQueue() {
	// sort queue before flush
	// this ensures that:
	// 1. Components are updated from parent to child. (because parent is always
	//    created before the child)
	// 2. A component's user watchers are run before its render watcher (because
	//    user watchers are created before the render watcher)
	// 3. If a conponent is destoryed during a parent component's watcher run,
	//    its watchers can be skipped.
	queue.sort((a, b) => a.id - b.id)

	// more watchers might be pushed as we run existing watchers
	for (let i = 0; i < queue.length; i++) {
		const watcher = queue[i]
		watcher.run()
	}
	
	resetSchedulerState()
}

function resetSchedulerState() {
	queue.length = 0
	has = {}
}