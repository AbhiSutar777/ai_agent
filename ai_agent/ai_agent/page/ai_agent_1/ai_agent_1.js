// frappe.pages['ai-agent-1'].on_page_load = function(wrapper) {
// 	var page = frappe.ui.make_app_page({
// 		parent: wrapper,
// 		title: 'None',
// 		single_column: true
// 	});
// }

// frappe.pages['ai-agent'].on_page_load = function (wrapper) {
//     new MyPage(wrapper);
// };

// // PAGE CONTENT
// MyPage = Class.extend({
//     init: function (wrapper) {
//         this.page = frappe.ui.make_app_page({
//             parent: wrapper,
//             title: '',
//             single_column: true
//         });

//         // Make page content
//         this.make();
//     },

//     // Define the make function
//     make: function () {
//         // Reference to the current instance
//         let me = this;

//         // Body content
//         let body = '<h1 style="color: white;">Hello, World</h1>'; // Added inline style for better visibility on dark background

//         // Set the background color of the page
//         $(me.page.body).css({
//             'background-color': '#003474',
//             'height': '100vh', // Ensures full height coverage
//             'margin': '0',
//             'padding': '20px' // Adds some padding to the content
//         });

//         // Append the content to the page body
//         $(body).appendTo(me.page.body);
//     }
// });

// // ================================================================================================================================

frappe.pages['ai-agent-1'].on_page_load = function (wrapper) {
    new ChatBotPage(wrapper);
};

// PAGE CONTENT
ChatBotPage = Class.extend({
    init: function (wrapper) {
        this.page = frappe.ui.make_app_page({
            parent: wrapper,
            title: 'AI Agent 1',
            single_column: true
        });

        // Build the page layout
        this.build_layout();
    },

    build_layout: function () {
        const me = this;

        // Set the main page body styling for responsiveness
        $(me.page.body).css({
            'background-color': '#F0F0F0', // Light gray background
            'height': '100vh',
            'display': 'flex',
            'flex-direction': 'column',
            'color': '#333', // Dark text for better contrast
            'font-family': 'Arial, sans-serif',
        });

        // Chat output section
        const output_section = $(`
            <div id="chat-output" style="
                flex: 1;
                overflow-y: auto;
                background-color: white; /* White background for chat area */
                border-radius: 8px;
                box-shadow: 0 0px 5px rgba(0, 0, 0, 0.4);
                padding: 20px;
                margin-bottom: 10px;
                word-wrap: break-word;
                display: flex;
                flex-direction: column;
                gap: 15px;
                font-size: 14px;
            ">
                <div style="color: #666; text-align: center;">Start your conversation...</div>
            </div>
        `);

        // Chat input section
        const input_section = $(`
            <div style="
                display: flex;
                align-items: center;
                background-color: white; /* White input area */
                padding: 10px;
                border-top: 1px solid #e0e0e0;
                position: sticky;
                bottom: 0;
                left: 0;
                width: 100%;
                box-sizing: border-box;
                box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
            ">
                <textarea id="chat-input" placeholder="Type your message..." style="
                    flex: 1;
                    border: 1px solid #ccc;
                    outline: none;
                    padding: 10px;
                    font-size: 14px;
                    border-radius: 8px;
                    resize: none;
                    height: 40px;
                    max-height: 80px;
                    overflow-y: auto;
                    color: #333;
                    background-color: #fff;
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
                "></textarea>
                <button id="send-btn" style="
                    background-color: #007bff;
                    color: white;
                    border: none;
                    outline: none;
                    padding: 10px 20px;
                    margin-left: 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.2s ease;
                ">Send</button>
            </div>
        `);

        // Append sections to the page body
        $(me.page.body).append(output_section);
        $(me.page.body).append(input_section);

        // Add functionality to the Send button
        $('#send-btn').on('click', function () {
            me.handle_user_message();
        });

        // Handle input on pressing Enter
        $('#chat-input').on('keypress', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent newline
                me.handle_user_message();
            }
        });
    },

    handle_user_message: function () {
        const user_input = $('#chat-input').val().trim();
        if (!user_input) {
            return; // Ignore empty messages
        }

        // Append user message to the output section
        $('#chat-output').append(`
            <div style="align-self: flex-end; text-align: right; width: 100%;">
                <div style="
                    display: inline-block;
                    background-color: #007bff; /* Blue for user messages */
                    color: white;
                    padding: 10px 15px;
                    border-radius: 20px;
                    font-size: 14px;
                    max-width: 100%;
                    word-wrap: break-word;
                ">${user_input}</div>
            </div>
        `);

        // Clear the input field
        $('#chat-input').val('');

        // Call the Python function to get a response
        frappe.call({
            method: 'ai_agent.ai_agent.page.ai_agent_1.ai_agent_1.get_response', // Replace 'your_app' with your app's name
            args: { message: user_input },
            callback: function (response) {
                const bot_response = response.message || "Sorry, I couldn't process that.";
                // Append bot response to the output section
                $('#chat-output').append(`
                    <div style="align-self: flex-start; text-align: left; width: 100%; display: flex; align-items: center; gap: 10px;">
                        <div style="
                            display: inline-block;
                            background-color: #e0e0e0; /* Light gray for bot messages */
                            color: #333; /* Dark text */
                            padding: 10px 15px;
                            border-radius: 20px;
                            font-size: 14px;
                            max-width: 100%;
                            word-wrap: break-word;
                        ">${bot_response}</div>
                        <button style="
                            background: none;
                            border: none;
                            outline: none;
                            cursor: pointer;
                            color: #007bff;
                            font-size: 16px;
                        " title="Download" data-user-input="${user_input}" data-bot-response="${bot_response}">
                            📥
                        </button>
                    </div>
                `);

                // Attach download functionality to the button
                $('#chat-output').find('button[title="Download"]').last().on('click', function () {
                    const user_input = $(this).data('user-input');
                    const bot_response = $(this).data('bot-response');
                    frappe.call({
                        method: 'ai_agent.ai_agent.page.ai_agent_1.ai_agent_1.download_response', // Replace with your Python method
                        args: { user_input: user_input, bot_response: bot_response },
                        callback: function(r) {
							frappe.show_alert({
							    message:__('Downloading Response'),
							    indicator:'green'
							}, 3);
							window.location.href = r.message.file_url;
						}
                    });
                    // window.location.href = r.message.file_url;
                    // console.log(user_input)
                });

                // Auto-scroll to the bottom
                const chatOutput = document.getElementById('chat-output');
                chatOutput.scrollTop = chatOutput.scrollHeight;
            }
        });
    }
});


// frappe.pages['ai-agent-1'].on_page_load = function (wrapper) {
//     new ChatBotPage(wrapper);
// };

// // PAGE CONTENT
// ChatBotPage = Class.extend({
//     init: function (wrapper) {
//         this.page = frappe.ui.make_app_page({
//             parent: wrapper,
//             title: 'AI Agent 1',
//             single_column: true
//         });

//         // Build the page layout
//         this.build_layout();
//     },

//     build_layout: function () {
//         const me = this;

//         // Set the main page body styling for responsiveness
//         $(me.page.body).css({
//             'background-color': '#F0F0F0', // Light gray background
//             'height': '100vh',
//             'display': 'flex',
//             'flex-direction': 'column',
//             'color': '#333', // Dark text for better contrast
//             'font-family': 'Arial, sans-serif',
//         });

//         // Chat output section
//         const output_section = $(`
//             <div id="chat-output" style="
//                 flex: 1;
//                 overflow-y: auto;
//                 background-color: white; /* White background for chat area */
//                 border-radius: 8px;
//                 box-shadow: 0 0px 5px rgba(0, 0, 0, 0.4);
//                 padding: 20px;
//                 margin-bottom: 10px;
//                 word-wrap: break-word;
//                 display: flex;
//                 flex-direction: column;
//                 gap: 15px;
//                 font-size: 14px;
//             ">
//                 <div style="color: #666; text-align: center;">Start your conversation...</div>
//             </div>
//         `);

//         // Chat input section
//         const input_section = $(`
//             <div style="
//                 display: flex;
//                 align-items: center;
//                 background-color: white; /* White input area */
//                 padding: 10px;
//                 border-top: 1px solid #e0e0e0;
//                 position: sticky;
//                 bottom: 0;
//                 left: 0;
//                 width: 100%;
//                 box-sizing: border-box;
//                 box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
//             ">
//                 <textarea id="chat-input" placeholder="Type your message..." style="
//                     flex: 1;
//                     border: 1px solid #ccc;
//                     outline: none;
//                     padding: 10px;
//                     font-size: 14px;
//                     border-radius: 8px;
//                     resize: none;
//                     height: 40px;
//                     max-height: 80px;
//                     overflow-y: auto;
//                     color: #333;
//                     background-color: #fff;
//                     box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
//                 "></textarea>
//                 <button id="send-btn" style="
//                     background-color: #007bff;
//                     color: white;
//                     border: none;
//                     outline: none;
//                     padding: 10px 20px;
//                     margin-left: 10px;
//                     border-radius: 8px;
//                     cursor: pointer;
//                     font-size: 14px;
//                     transition: background-color 0.2s ease;
//                 ">Send</button>
//             </div>
//         `);

//         // Append sections to the page body
//         $(me.page.body).append(output_section);
//         $(me.page.body).append(input_section);

//         // Add functionality to the Send button
//         $('#send-btn').on('click', function () {
//             me.handle_user_message();
//         });

//         // Handle input on pressing Enter
//         $('#chat-input').on('keypress', function (e) {
//             if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault(); // Prevent newline
//                 me.handle_user_message();
//             }
//         });
//     },

//     handle_user_message: function () {
//         const user_input = $('#chat-input').val().trim();
//         if (!user_input) {
//             return; // Ignore empty messages
//         }

//         // Append user message to the output section
//         $('#chat-output').append(`
//             <div style="align-self: flex-end; text-align: right; width: 100%;">
//                 <div style="
//                     display: inline-block;
//                     background-color: #007bff; /* Blue for user messages */
//                     color: white;
//                     padding: 10px 15px;
//                     border-radius: 20px;
//                     font-size: 14px;
//                     max-width: 100%;
//                     word-wrap: break-word;
//                 ">${user_input}</div>
//             </div>
//         `);

//         // Clear the input field
//         $('#chat-input').val('');

//         // Call the Python function to get a response
//         frappe.call({
//             method: 'ai_agent.ai_agent.page.ai_agent_1.ai_agent_1.get_response', // Replace 'your_app' with your app's name
//             args: { message: user_input },
//             callback: function (response) {
//                 const bot_response = response.message || "Sorry, I couldn't process that.";
//                 // Append bot response to the output section
//                 $('#chat-output').append(`
//                     <div style="align-self: flex-start; text-align: left; width: 100%; display: flex; align-items: center; gap: 10px;">
//                         <div style="
//                             display: inline-block;
//                             background-color: #e0e0e0; /* Light gray for bot messages */
//                             color: #333; /* Dark text */
//                             padding: 10px 15px;
//                             border-radius: 20px;
//                             font-size: 14px;
//                             max-width: 100%;
//                             word-wrap: break-word;
//                         ">${bot_response}</div>
//                         <button style="
//                             background: none;
//                             border: none;
//                             outline: none;
//                             cursor: pointer;
//                             color: #007bff;
//                             font-size: 16px;
//                         " title="Download" data-response="${bot_response}">
//                             📥
//                         </button>
//                     </div>
//                 `);

//                 // Attach download functionality to the button
//                 $('#chat-output').find('button[title="Download"]').last().on('click', function () {
//                     const response = $(this).data('response');
//                     frappe.call({
//                         method: 'ai_agent.ai_agent.page.ai_agent_1.ai_agent_1.download_response', // Replace with your Python method
//                         args: { response: response },
//                     });
//                 });

//                 // Auto-scroll to the bottom
//                 const chatOutput = document.getElementById('chat-output');
//                 chatOutput.scrollTop = chatOutput.scrollHeight;
//             }
//         });
//     }
// });





// frappe.pages['ai-agent-1'].on_page_load = function (wrapper) {
//     new ChatBotPage(wrapper);
// };

// // PAGE CONTENT
// ChatBotPage = Class.extend({
//     init: function (wrapper) {
//         this.page = frappe.ui.make_app_page({
//             parent: wrapper,
//             title: 'AI Agent 1',
//             single_column: true
//         });

//         // Build the page layout
//         this.build_layout();
//     },

//     build_layout: function () {
//         const me = this;

//         // Set the main page body styling for responsiveness
//         $(me.page.body).css({
//             'background-color': '#F0F0F0', // Light gray background
//             'height': '100vh',
//             'display': 'flex',
//             'flex-direction': 'column',
//             'color': '#333', // Dark text for better contrast
//             'font-family': 'Arial, sans-serif',
//         });

//         // Chat output section
//         const output_section = $(`
//             <div id="chat-output" style="
//                 flex: 1;
//                 overflow-y: auto;
//                 background-color: white; /* White background for chat area */
//                 border-radius: 8px;
//                 box-shadow: 0 0px 5px rgba(0, 0, 0, 0.4);
//                 padding: 20px;
//                 margin-bottom: 10px;
//                 word-wrap: break-word;
//                 display: flex;
//                 flex-direction: column;
//                 gap: 15px;
//                 font-size: 14px;
//             ">
//                 <div style="color: #666; text-align: center;">Start your conversation...</div>
//             </div>
//         `);

//         // Chat input section
//         const input_section = $(`
//             <div style="
//                 display: flex;
//                 align-items: center;
//                 background-color: white; /* White input area */
//                 padding: 10px;
//                 border-top: 1px solid #e0e0e0;
//                 position: sticky;
//                 bottom: 0;
//                 left: 0;
//                 width: 100%;
//                 box-sizing: border-box;
//                 box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
//             ">
//                 <textarea id="chat-input" placeholder="Type your message..." style="
//                     flex: 1;
//                     border: 1px solid #ccc;
//                     outline: none;
//                     padding: 10px;
//                     font-size: 14px;
//                     border-radius: 8px;
//                     resize: none;
//                     height: 40px;
//                     max-height: 80px;
//                     overflow-y: auto;
//                     color: #333;
//                     background-color: #fff;
//                     box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
//                 "></textarea>
//                 <button id="send-btn" style="
//                     background-color: #007bff;
//                     color: white;
//                     border: none;
//                     outline: none;
//                     padding: 10px 20px;
//                     margin-left: 10px;
//                     border-radius: 8px;
//                     cursor: pointer;
//                     font-size: 14px;
//                     transition: background-color 0.2s ease;
//                 ">Send</button>
//             </div>
//         `);

//         // Append sections to the page body
//         $(me.page.body).append(output_section);
//         $(me.page.body).append(input_section);

//         // Add functionality to the Send button
//         $('#send-btn').on('click', function () {
//             me.handle_user_message();
//         });

//         // Handle input on pressing Enter
//         $('#chat-input').on('keypress', function (e) {
//             if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault(); // Prevent newline
//                 me.handle_user_message();
//             }
//         });
//     },

//     handle_user_message: function () {
//         const user_input = $('#chat-input').val().trim();
//         if (!user_input) {
//             return; // Ignore empty messages
//         }

//         // Append user message to the output section
//         $('#chat-output').append(`
//             <div style="align-self: flex-end; text-align: right; width: 100%;">
//                 <div style="
//                     display: inline-block;
//                     background-color: #007bff; /* Blue for user messages */
//                     color: white;
//                     padding: 10px 15px;
//                     border-radius: 20px;
//                     font-size: 14px;
//                     max-width: 100%;
//                     word-wrap: break-word;
//                 ">${user_input}</div>
//             </div>
//         `);

//         // Clear the input field
//         $('#chat-input').val('');

//         // Call the Python function to get a response
//         frappe.call({
//             method: 'ai_agent.ai_agent.page.ai_agent_1.ai_agent_1.get_response', // Replace 'your_app' with your app's name
//             args: { message: user_input },
//             callback: function (response) {
//                 const bot_response = response.message || "Sorry, I couldn't process that.";
//                 // Append bot response to the output section
//                 $('#chat-output').append(`
//                     <div style="align-self: flex-start; text-align: left; width: 100%;">
//                         <div style="
//                             display: inline-block;
//                             background-color: #e0e0e0; /* Light gray for bot messages */
//                             color: #333; /* Dark text */
//                             padding: 10px 15px;
//                             border-radius: 20px;
//                             font-size: 14px;
//                             max-width: 100%;
//                             word-wrap: break-word;
//                         ">${bot_response}</div>
//                     </div>
//                 `);

//                 // Auto-scroll to the bottom
//                 const chatOutput = document.getElementById('chat-output');
//                 chatOutput.scrollTop = chatOutput.scrollHeight;
//             }
//         });
//     }
// });


// // ================================================================================================================================

// frappe.pages['ai-agent-1'].on_page_load = function (wrapper) {
//     new ChatBotPage(wrapper);
// };

// // PAGE CONTENT
// ChatBotPage = Class.extend({
//     init: function (wrapper) {
//         this.page = frappe.ui.make_app_page({
//             parent: wrapper,
//             title: 'AI Agent 1',
//             single_column: true
//         });

//         // Build the page layout
//         this.build_layout();
//     },

//     build_layout: function () {
//         const me = this;

//         // Set the main page body styling for responsiveness
//         $(me.page.body).css({
//             'background-color': '#F0F0F0', // Light gray background
//             'height': '100vh',
//             'display': 'flex',
//             'flex-direction': 'column',
//             'color': '#333', // Dark text for better contrast
//             'font-family': 'Arial, sans-serif',
//         });

//         // Chat output section
//         const output_section = $(`
//             <div id="chat-output" style="
//                 flex: 1;
//                 overflow-y: auto;
//                 background-color: white; /* White background for chat area */
//                 border-radius: 8px;
//                 box-shadow: 0 0px 4px rgba(0, 0, 0, 0.5);
//                 padding: 20px;
//                 margin-bottom: 10px;
//                 word-wrap: break-word;
//                 display: flex;
//                 flex-direction: column;
//                 gap: 15px;
//                 font-size: 14px;
//             ">
//                 <div style="color: #666; text-align: center;">Start your conversation...</div>
//             </div>
//         `);

//         // Chat input section
//         const input_section = $(`
//             <div style="
//                 display: flex;
//                 align-items: center;
//                 background-color: white; /* White input area */
//                 padding: 10px;
//                 border-top: 1px solid #e0e0e0;
//                 position: sticky;
//                 bottom: 0;
//                 left: 0;
//                 width: 100%;
//                 box-sizing: border-box;
//                 box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
//             ">
//                 <textarea id="chat-input" placeholder="Type your message..." style="
//                     flex: 1;
//                     border: 1px solid #ccc;
//                     outline: none;
//                     padding: 10px;
//                     font-size: 14px;
//                     border-radius: 8px;
//                     resize: none;
//                     height: 40px;
//                     max-height: 80px;
//                     overflow-y: auto;
//                     color: #333;
//                     background-color: #fff;
//                     box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
//                 "></textarea>
//                 <button id="send-btn" style="
//                     background-color: #007bff;
//                     color: white;
//                     border: none;
//                     outline: none;
//                     padding: 10px 20px;
//                     margin-left: 10px;
//                     border-radius: 8px;
//                     cursor: pointer;
//                     font-size: 14px;
//                     transition: background-color 0.2s ease;
//                 ">Send</button>
//             </div>
//         `);

//         // Append sections to the page body
//         $(me.page.body).append(output_section);
//         $(me.page.body).append(input_section);

//         // Add functionality to the Send button
//         $('#send-btn').on('click', function () {
//             me.handle_user_message();
//         });

//         // Handle input on pressing Enter
//         $('#chat-input').on('keypress', function (e) {
//             if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault(); // Prevent newline
//                 me.handle_user_message();
//             }
//         });
//     },

//     handle_user_message: function () {
//         const user_input = $('#chat-input').val().trim();
//         if (!user_input) {
//             return; // Ignore empty messages
//         }

//         // Append user message to the output section
//         $('#chat-output').append(`
//             <div style="align-self: flex-end; text-align: right; width: 100%;">
//                 <div style="
//                     display: inline-block;
//                     background-color: #007bff; /* Blue for user messages */
//                     color: white;
//                     padding: 10px 15px;
//                     border-radius: 20px;
//                     font-size: 14px;
//                     max-width: 100%;
//                     word-wrap: break-word;
//                 ">${user_input}</div>
//             </div>
//         `);

//         // Clear the input field
//         $('#chat-input').val('');

//         // Simulate bot response (you can replace this with an API call)
//         setTimeout(() => {
//             this.add_bot_response(`I'm here to help! You said: "${user_input}"`);
//         }, 500);

//         // Auto-scroll to the bottom
//         const chatOutput = document.getElementById('chat-output');
//         chatOutput.scrollTop = chatOutput.scrollHeight;
//     },

//     add_bot_response: function (response) {
//         // Append bot message to the output section
//         $('#chat-output').append(`
//             <div style="align-self: flex-start; text-align: left; width: 100%;">
//                 <div style="
//                     display: inline-block;
//                     background-color: #e0e0e0; /* Light gray for bot messages */
//                     color: #333; /* Dark text */
//                     padding: 10px 15px;
//                     border-radius: 20px;
//                     font-size: 14px;
//                     max-width: 100%;
//                     word-wrap: break-word;
//                 ">${response}</div>
//             </div>
//         `);

//         // Auto-scroll to the bottom
//         const chatOutput = document.getElementById('chat-output');
//         chatOutput.scrollTop = chatOutput.scrollHeight;
//     }
// });


// // ================================================================================================================================
