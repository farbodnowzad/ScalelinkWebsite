var page_1 = [
    {
        "title": "Title",
        "subtitle": "Create a name to help identify the campaign",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "title",
        "placeholder": "20% Off New Product Line",
        "required": true
    },
    {
        "title": "URL",
        "subtitle": "Where should people be directed to when they engage with an influencer's content?",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "url",
        "placeholder": "acme.com",
        "required": true,
    },
    {
        "title": "Banner Image",
        "class": "login-sign-up-input",
        "type": "file",
        "name": "primary_image",
        "required": true,
    },
    {
        "title": "What should potential influencers know about this campaign?",
        "subtitle": "Give details about the campaign such as what the product or service is. Use this space to provide more context.",
        "class": "login-sign-up-input",
        "class_style": "long_text",
        "type": "text",
        "name": "about",
        "placeholder": "Enter details",
        "required": true
    },
    // {
    //     "title": "Add any additional images here",
    //     "class": "login-sign-up-input",
    //     "type": "file",
    //     "name": "secondary_attachments",
    //     "meta": "multiple"
    // },
]

var page_2 = [
    {
        "title": "What should influencers mention in their posts?",
        "subtitle": "Discuss talking points, content that they should include, or specific things to say about the product or service",
        "class": "login-sign-up-input",
        "class_style": "long_text",
        "type": "text",
        "name": "do_mention",
        "placeholder": "Enter here",
    },
    {
        "title": "What should influencers NOT mention in their posts?",
        "class": "login-sign-up-input",
        "class_style": "long_text",
        "type": "text",
        "name": "do_not_mention",
        "placeholder": "Enter here",
    },
    {
        "title": "Do you want to approve influencers before they can start sharing?",
        "subtitle": "Requests from influencers will be visible in Notifications.",
        "class": "login-sign-up-input",
        "type": "select",
        "name": "requires_approval",
        "options": ["Yes", "No"],
        "placeholder": "Select One...",
        "required": true
    },
    {
        "title": "Will you send a product to influencers before they can start sharing?",
        "subtitle": "Requests from influencers will be visible in Notifications.",
        "class": "login-sign-up-input",
        "type": "select",
        "name": "requires_product",
        "options": ["Yes", "No"],
        "placeholder": "Select One...",
        "required": true
    },
]

var page_3 = [
    {
        "title": "Set an expiration date",
        "class": "login-sign-up-input",
        "type": "date",
        "name": "expiration",
        "required": true
    },
    {
        "title": "How much do you want to spend on this campaign?",
        "class": "login-sign-up-input",
        "type": "budget",
        "name": "budget",
        "placeholder": "$10,000",
        "required": true
    },
    {
        "title": "What is the maximum amount that one person can make?",
        "class": "login-sign-up-input",
        "type": "number",
        "name": "max_payout",
        "placeholder": "No maximum"
    },
    {
        "title": "What is the minimum number of unique visitors a link must receive before the influencers is paid?",
        "class": "login-sign-up-input",
        "type": "number",
        "name": "min_payout",
        "placeholder": 0
    }
]

var page_4 = [
    {
        "title": "Do you want to target influencers of a specific gender?",
        "class": "login-sign-up-input",
        "type": "checkbox",
        "name": "gender",
        "options": ["Male", "Female", "Other"],
    },
    {
        "title": "Do you want to target influencers in a specific age range?",
        "class": "login-sign-up-input",
        "type": "checkbox",
        "name": "age",
        "options": ["< 18", "18-24", "25-34", "35-44", "45-64", "65+"],
    },
    {
        "title": "Do you want to target influencers in a specific region?",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "regions",
        "class_style": "regions",
        "placeholder": "Los Angeles"
    }
]

var page_5 = [
    {
        "title": "Title",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "title",
        "placeholder": "The campaign title that users will see",
    },
    {
        "title": "URL",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "url",
        "placeholder": "Where should people go when they engage?",
    },
    {
        "title": "Banner Image",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "primary_image",
        "sub_type": "file"
    },
    {
        "title": "What should potential influencers know about this campaign?",
        "class": "login-sign-up-input",
        "class_style": "long_text",
        "type": "review",
        "name": "about",
        "placeholder": "Give details about the campaign such as what the product or service is. Please metition if you want creators to use any of the additional images. Use this space to provide more context.",
    },
    {
        "title": "Add any additional images here",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "secondary_attachments",
        "meta": "multiple"
    },
    {
        "title": "What should influencers mention in their posts?",
        "class": "login-sign-up-input",
        "class_style": "long_text",
        "type": "review",
        "name": "do_mention",
        "placeholder": "Discuss talking points or things to emphasize",
    },
    {
        "title": "What should influencers NOT mention in their posts?",
        "class": "login-sign-up-input",
        "class_style": "long_text",
        "type": "review",
        "name": "do_not_mention",
        "placeholder": "Discuss topics or names to avoid",
    },
    {
        "title": "Do you want to approve influencers before they can start sharing?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "requires_approval",
        "options": ["Yes", "No"],
        "placeholder": "Select One...",
    },
    {
        "title": "Will you send a product to influencers before they can start sharing?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "requires_product",
        "options": ["Yes", "No"],
        "placeholder": "Select One...",
    },
    {
        "title": "Set an expiration date",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "expiration",
    },
    {
        "title": "How much do you want to spend on this campaign?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "budget",
        "placeholder": "$10,000"
    },
    {
        "title": "What is the maximum amount that one person can make?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "max_payout",
        "placeholder": "No maximum"
    },
    {
        "title": "Do you want to target influencers of a specific gender?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "gender",
        "options": ["Male", "Female", "Other"],
    },
    {
        "title": "Do you want to target influencers in a specific age range?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "age",
        "options": ["< 18", "18-24", "25-34", "35-44", "45-64", "65+"],
    },
    {
        "title": "Do you want to target influencers in a specific region?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "region",
        "placeholder": "Los Angeles"
    }
]

const pages = [page_1, page_2, page_3, page_4, page_5]
export {pages}