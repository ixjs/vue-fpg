import Input from './items/input';
import Password from './items/password';
import Textarea from './items/textarea';
import Checkbox from './items/checkbox';
import HtmlEditor from './items/htmlEditor';

var itemHT = {
	'bool': Checkbox,
	'number': Input,
	'string': Input,
	'password': Password,
	'text': Textarea,
	'html': HtmlEditor
};

export default {
	register(name, cmp) {
		if (name in itemHT)
			return;
		itemHT[name] = cmp;
	},
	get(name) {
		return itemHT[name || 'string'] || null;
	}
};

