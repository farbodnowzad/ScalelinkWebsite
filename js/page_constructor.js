class PageConstructor {
    constructor(variables, pages, document) {
      this.variables = variables;
      this.pages = pages;
      this.document = document;
      this.current_page = 0
    }

    show() {
        var page = this.pages[this.current_page]
        var sections = this.document.getElementById("login-sign-up-inputs-wrapper")
        sections.innerHTML = ``
        for (let section of page) {
            var filled_section = this.create_section(section, this.save_text, this.save_select, this.save_checkbox);
            sections.innerHTML += filled_section;
        }
        if (this.current_page == 0) {
            this.document.getElementById("back-button").hidden = true;
        } else {
            this.document.getElementById("back-button").hidden = false;
        }
        if (this.current_page == this.pages.length-1) {
            this.document.getElementById("login-signup-action-button").innerHTML = "Sign Up";
        } else {
            this.document.getElementById("login-signup-action-button").innerHTML = "Next";
        }
        var self = this;
        $(this.document).on("change", "input[type='text']", function() {
            self.variables[this.name] = this.value;
        })
        $(this.document).on("change", "input[type='checkbox']", function() {
            if (this.checked) {
                self.variables[this.name].push(this.value)
            } else {
                var index = self.variables[this.name].indexOf(this.value)
                self.variables[this.name].splice(index, 1)
            }
        })
        $(this.document).on("change", "select", function() {
            self.variables[this.name] = this.value.toLowerCase();
        })
    }

    create_section(section) {
        if (section.type == "select") {
            var select = `
            <div class="login-sign-up-input-row">
            <span class='login-sign-up-input-row-name'>${section.title}</span><br>
            <select name="${section.name}" class="${section.class}">
                <option value="" disabled selected>${section.placeholder}</option>
            `
            for (let val of section.options) {
                var select_toggled = this.variables[section.name] == val.toLowerCase() ? "selected" : "!selected"
                select += `<option value="${val.toLowerCase()}" ${select_toggled}>${val}</option>`
            }
            select += '</select></div>'
            return select
        }
        else if (section.type == "checkbox") {
            var checkbox = `<div class="login-sign-up-input-row">
            <span class='login-sign-up-input-row-name'>${section.title}</span><br>`
            for (let val of section.options) {
                var check_toggled = this.variables[section.name].includes(val.toLowerCase()) ? "checked" : "!checked"
                checkbox += `<div class="sign-up-checkbox">
                <input class="single-checkbox" type="checkbox" name="${section.name}" value="${val.toLowerCase()}" ${check_toggled}>
                <label for="${val.toLowerCase()}"> ${val}</label><br>
                </div>
                `
            }
            checkbox += '</div>'
            return checkbox
        } else {
            return `
            <div class="login-sign-up-input-row">
                <span class='login-sign-up-input-row-name'>${section.title}</span><br>
                <input class="${section.class}" style="${section.style}" type="${section.type}" name="${section.name}" placeholder="${section.placeholder}" value="${this.variables[section.name]}"/>
            </div>
            `
        }
    }
    
    next_page() {
        if (this.current_page < this.pages.length-1) {
            this.current_page += 1
            this.show()
        }
    }

    previous_page() {
        if (this.current_page > 0) {
            this.current_page -= 1
            this.show()
        }
    }
}

export {PageConstructor}
