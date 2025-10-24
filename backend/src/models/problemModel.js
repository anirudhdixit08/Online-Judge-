import mongoose from "mongoose";

const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true 
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    tags: [
        {
            type: String,
            enum: [
                'Array', 
                'String',
                'Hash Table', 
                'Map',
                'Dynamic Programming', 
                'Math', 
                'Bit Manipulation',
                'Sorting',
                'Searching',
                'Binary Search',
                'Two Pointers',
                'Sliding Window',
                'Stack',
                'Queue',
                'Linked List', 
                'Tree',
                'Binary Tree',
                'Binary Search Tree',
                'Graph',
                'Depth-First Search',
                'Breadth-First Search',
                'Recursion',
                'Backtracking',
                'Greedy',
                'Heap',
                'Trie',
                'Matrix',
                'Geometry'
            ]
        }
    ],
    visibleTestCases: {
        type: [{
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            },
            explanation: {
                type: String,
                required: true
            }
        }],
        required: [true, 'At least one visible test case is required'],
        validate: [val => val.length > 0, 'At least one visible test case is required']
    },
    hiddenTestCases: {
        type: [{
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            }
        }],
        required: [true, 'At least one hidden test case is required'],
        validate: [val => val.length > 0, 'At least one hidden test case is required']
    },
    startCode: {
        type: [
            {
                language: {
                    type: String,
                    enum: ['c++', 'java', 'python', 'c', 'javascript'],
                    required: true,
                },
                initialCode: {
                    type: String,
                    required: true,
                },
            }
        ],
        required: [true, 'At least one starter code template is required'],
        validate: [val => val.length > 0, 'At least one starter code template is required']
    },
    problemCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
