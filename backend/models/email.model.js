import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: "User"
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isStarred: {  // Changed from isStar to be more descriptive
        type: Boolean,
        default: false
    },
    send: {
        type: Boolean,
        default: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: ["primary", "social", "promotion"],  // Fixed typo in "promotion"
        default: "primary"
    },
    isArchived: {  // Changed from archived for consistency
        type: Boolean,
        default: false
    },
    snoozeInfo: {  // New nested object for snooze details snoozeInfo.isSnoozed
        isSnoozed: {
            type: Boolean,
            default: false
        },
        snoozeUntil: {
            type: Date,
            default: null
        },
        originalCategory: {  // Store original category before snooze
            type: String,
            enum: ["primary", "social", "promotion"]
        }
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    labels: [{  // Added for better email organization
        type: String,
        enum: ["work", "personal", "important"]
    }]
}, { 
    timestamps: true,
    toJSON: { virtuals: true },  // Enable virtuals when converting to JSON
    toObject: { virtuals: true } 
});

// Virtual property to check if email is currently snoozed
emailSchema.virtual('isCurrentlySnoozed').get(function() {
    if (!this.snoozeInfo.isSnoozed) return false;
    if (!this.snoozeInfo.snoozeUntil) return false;
    return new Date() < this.snoozeInfo.snoozeUntil;
});

// Indexes for better query performance
emailSchema.index({ userId: 1 });
emailSchema.index({ 'snoozeInfo.snoozeUntil': 1 });
emailSchema.index({ isStarred: 1 });
emailSchema.index({ isRead: 1 });
emailSchema.index({ 'snoozeInfo.isSnoozed': 1 });

export const Email = mongoose.model("Email", emailSchema);