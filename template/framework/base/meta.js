module.exports = {
  "helpers": {
    "if_or": function (v1, v2, options) {
      if (v1 || v2)
        return options.fn(this);
      return options.inverse(this);
    }
  },
  "prompts": {
    "name": {
      "type": "string",
      "required": true,
      "message": "Project Group's name"
    },
    "port": {
      "type": "number",
      "required": true,
      "default": "8080",
      "message": "Project Developing Port"
    },
    "owner": {
      "type": "string",
      "required": false,
      "message": "Project Group's owner",
      "default": "nobody"
    },
    "author": {
      "type": "string",
      "required": false,
      "message": "Author",
      "default": "nobody@xxx.com"
    },
    "title": {
      "type": "string",
      "required": false,
      "message": "Title",
      "default": ""
    }
  },
  "skipInterpolation": "src/**/*.vue",
  "completeMessage": "To get started:\n\n\tnpm run dev:{{ name }}\n\n"
};
