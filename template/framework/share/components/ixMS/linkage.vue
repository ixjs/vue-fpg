<template>
	<div class="ix-msl" :class='{ "v-layout": !isVertical }'>
		<component :is='master' class="ix-msl-master" 
				:selectedItem='selectedItem'
				@deliver='deliverToSlave'/>
		<component :is='slaveCmp' class="ix-msl-slave" 
				:selectedItem='selectedItem'
				:delivery='deliveryData'
				@deliver='deliver'/>
	</div>
</template>

<script>
import selectedMixin from './selectedMixin';
import masterMixin from './masterMixin';

export default {
	name: 'IXMSLinkage',
	mixins: [selectedMixin, masterMixin],
	props: {
		deliveryKeys: { type: String, default: 'id' },
		isVertical: { type: Boolean, default: true },
		master: { type: Object, default: null },
		slave: { type: Object, default: null }
	},
	data() {
		return {
			slaveCmp: null,
			deliveryData: {}
		};
	},
	methods: {
		setSlaveCmp(key) {
			this.slaveCmp = ('default' in this.slave) ? this.slave[key] : this.slave;
			this.deliverKey = key;
		},
		deliverToSlave(item, key) {
			if (this.keys == null)
				return; // console.log('no delivery keys');
			// console.log('try deliver:', this.keys, item, key);
			var _key = key || 'default';
			var deliveryData = IX.loop(this.keys, {}, (acc, name) => {
				acc[name] = item[name];
				return acc;
			});
			var strDeliveryData = JSON.stringify(deliveryData);
			if (strDeliveryData == this.strDeliveryData && _key == this.deliverKey)
				return; // console.log("same delivery data");
		
			if (_key != this.deliverKey)
				this.setSlaveCmp(_key);

			this.strDeliveryData = strDeliveryData;
			this.deliveryData = deliveryData;
		}
	},
	mounted() {
		this.keys = this.deliveryKeys == '-' ? null : this.deliveryKeys.split(',');
		this.setSlaveCmp('default');
	}
};
</script>
<style lang='less'>
.ix-msl>.ix-msl-slave { border-top:3px solid #378;padding:10px; }
.ix-msl.v-layout{
	&>* {display:inline-block; width:40%;vertical-align:top;}
	&>.ix-msl-slave { border-top:0; border-left:3px solid #378; width:59%;}
}
</style>