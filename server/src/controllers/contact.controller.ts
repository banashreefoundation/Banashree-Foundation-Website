import Contact, { IContact } from '../model/contactModel';
import { Request, Response } from 'express';
import { CustomRequest } from '../middleware/auth';
import { Types } from 'mongoose';

// Utility function to validate ObjectId
const isValidObjectId = (id: string): boolean => {
    return Types.ObjectId.isValid(id);
};

// Utility function to sanitize input
const sanitizeContactInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
};

// Core business logic functions
const createContactInquiry = async (contactData: Partial<IContact>) => {
    const { name, email, phone, inquiryType, subject, message } = contactData;

    if (!name || !email || !inquiryType || !subject || !message) {
        return {
            error: 'Please provide all the required fields (name, email, inquiryType, subject, message)',
        };
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        return {
            error: 'Please provide a valid email address',
        };
    }

    // Validate inquiry type
    const validTypes = ['general', 'partnership', 'volunteer', 'donation', 'other'];
    if (!validTypes.includes(inquiryType)) {
        return {
            error: 'Invalid inquiry type. Valid types: general, partnership, volunteer, donation, other',
        };
    }

    // Validate message length
    if (message.length < 10) {
        return {
            error: 'Message must be at least 10 characters long',
        };
    }

    if (message.length > 2000) {
        return {
            error: 'Message cannot exceed 2000 characters',
        };
    }

    // Sanitize inputs
    const sanitizedData = {
        name: sanitizeContactInput(name),
        email: email.toLowerCase().trim(),
        phone: phone ? sanitizeContactInput(phone) : undefined,
        inquiryType,
        subject: sanitizeContactInput(subject),
        message: sanitizeContactInput(message),
        status: 'new' as const,
    };

    const newContact = new Contact(sanitizedData);
    await newContact.save();

    return {
        contact: newContact,
        message: 'Contact inquiry submitted successfully',
    };
};

const getAllContactInquiries = async (filters: any) => {
    const {
        page = 1,
        limit = 10,
        status,
        inquiryType,
        email,
        sortBy = 'createdAt',
        order = 'desc',
    } = filters;

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (inquiryType) filter.inquiryType = inquiryType;
    if (email) filter.email = new RegExp(email, 'i');

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort: any = { [sortBy]: sortOrder };

    // Execute query
    const contacts = await Contact.find(filter)
        .sort(sort)
        .limit(limitNum)
        .skip(skip)
        .populate('resolvedBy', 'name email');

    const total = await Contact.countDocuments(filter);

    return {
        contacts,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total,
            itemsPerPage: limitNum,
        },
    };
};

const getContactInquiryById = async (id: string) => {
    if (!isValidObjectId(id)) {
        return {
            error: 'Invalid contact ID format',
        };
    }

    const contact = await Contact.findById(id).populate('resolvedBy', 'name email');

    if (!contact) {
        return {
            error: 'Contact inquiry not found',
        };
    }

    return {
        contact,
    };
};

const updateContactInquiry = async (id: string, updates: Partial<IContact>) => {
    if (!isValidObjectId(id)) {
        return {
            error: 'Invalid contact ID format',
        };
    }

    // Define allowed updates
    const allowedUpdates = ['status', 'notes', 'inquiryType', 'subject', 'message'];
    const requestedUpdates = Object.keys(updates);

    const isValidUpdate = requestedUpdates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
        return {
            error: 'Invalid updates. Allowed fields: ' + allowedUpdates.join(', '),
        };
    }

    const contact = await Contact.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
    ).populate('resolvedBy', 'name email');

    if (!contact) {
        return {
            error: 'Contact inquiry not found',
        };
    }

    return {
        contact,
        message: 'Contact inquiry updated successfully',
    };
};

const updateContactStatus = async (id: string, status: string) => {
    if (!isValidObjectId(id)) {
        return {
            error: 'Invalid contact ID format',
        };
    }

    const validStatuses = ['new', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
        return {
            error: 'Invalid status. Valid values: ' + validStatuses.join(', '),
        };
    }

    const contact = await Contact.findById(id);

    if (!contact) {
        return {
            error: 'Contact inquiry not found',
        };
    }

    await contact.updateStatus(status as IContact['status']);

    return {
        contact,
        message: 'Contact status updated successfully',
    };
};

const resolveContactInquiry = async (id: string, adminId: string, notes?: string) => {
    if (!isValidObjectId(id)) {
        return {
            error: 'Invalid contact ID format',
        };
    }

    const contact = await Contact.findById(id);

    if (!contact) {
        return {
            error: 'Contact inquiry not found',
        };
    }

    if (contact.status === 'resolved') {
        return {
            error: 'Contact inquiry is already resolved',
        };
    }

    await contact.markAsResolved(adminId, notes);

    return {
        contact,
        message: 'Contact inquiry marked as resolved',
    };
};

const deleteContactInquiry = async (id: string) => {
    if (!isValidObjectId(id)) {
        return {
            error: 'Invalid contact ID format',
        };
    }

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
        return {
            error: 'Contact inquiry not found',
        };
    }

    return {
        contact,
        message: 'Contact inquiry deleted successfully',
    };
};

const deleteMultipleContactInquiries = async (ids: string[]) => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return {
            error: 'Please provide an array of contact IDs',
        };
    }

    // Validate all ObjectIds
    const invalidIds = ids.filter((id) => !isValidObjectId(id));
    if (invalidIds.length > 0) {
        return {
            error: 'Invalid contact IDs detected',
            invalidIds,
        };
    }

    const result = await Contact.deleteMany({ _id: { $in: ids } });

    return {
        deletedCount: result.deletedCount,
        message: `${result.deletedCount} contact inquiries deleted successfully`,
    };
};

// HTTP Request Handlers

/**
 * @route   POST /api/contacts
 * @desc    Create a new contact inquiry (Public - No Auth Required)
 * @access  Public
 */
export const handleCreateContact = async (req: Request, res: Response): Promise<any> => {
    if (!req.body) {
        return res.status(400).json({
            error: 'Request body is missing',
        });
    }

    const contactData: Partial<IContact> = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        inquiryType: req.body.inquiryType,
        subject: req.body.subject,
        message: req.body.message,
    };

    try {
        const result = await createContactInquiry(contactData);

        if (result.error) {
            return res.status(400).json({
                error: result.error,
            });
        }

        return res.status(201).json({
            success: true,
            message: result.message,
            data: result.contact,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to create contact inquiry',
            details: error.message,
        });
    }
};

/**
 * @route   GET /api/contacts
 * @desc    Get all contact inquiries with filtering and pagination
 * @access  Protected (Auth Required)
 */
export const handleGetAllContacts = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await getAllContactInquiries(req.query);

        return res.status(200).json({
            success: true,
            data: result.contacts,
            pagination: result.pagination,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to retrieve contacts',
            details: error.message,
        });
    }
};

/**
 * @route   GET /api/contacts/:id
 * @desc    Get single contact inquiry by ID
 * @access  Protected (Auth Required)
 */
export const handleGetContactById = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await getContactInquiryById(req.params.id);

        if (result.error) {
            return res.status(404).json({
                error: result.error,
            });
        }

        return res.status(200).json({
            success: true,
            data: result.contact,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to retrieve contact inquiry',
            details: error.message,
        });
    }
};

/**
 * @route   GET /api/contacts/email/:email
 * @desc    Get all contact inquiries by email
 * @access  Protected (Auth Required)
 */
export const handleGetContactsByEmail = async (req: Request, res: Response): Promise<any> => {
    try {
        const contacts = await Contact.findByEmail(req.params.email);

        return res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to retrieve contacts by email',
            details: error.message,
        });
    }
};

/**
 * @route   GET /api/contacts/type/:type
 * @desc    Get all contact inquiries by inquiry type
 * @access  Protected (Auth Required)
 */
export const handleGetContactsByType = async (req: Request, res: Response): Promise<any> => {
    try {
        const { type } = req.params;

        const validTypes = ['general', 'partnership', 'volunteer', 'donation', 'other'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                error: 'Invalid inquiry type',
            });
        }

        const contacts = await Contact.findByInquiryType(type as IContact['inquiryType']);

        return res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to retrieve contacts by type',
            details: error.message,
        });
    }
};

/**
 * @route   GET /api/contacts/pending
 * @desc    Get all pending contact inquiries
 * @access  Protected (Auth Required)
 */
export const handleGetPendingContacts = async (req: Request, res: Response): Promise<any> => {
    try {
        const contacts = await Contact.findPendingInquiries();

        return res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to retrieve pending inquiries',
            details: error.message,
        });
    }
};

/**
 * @route   GET /api/contacts/stats
 * @desc    Get contact statistics by inquiry type
 * @access  Protected (Auth Required)
 */
export const handleGetContactStats = async (req: Request, res: Response): Promise<any> => {
    try {
        const stats = await Contact.getStatsByType();
        const totalContacts = await Contact.countDocuments();
        const pendingContacts = await Contact.countDocuments({
            status: { $in: ['new', 'in-progress'] },
        });
        const resolvedContacts = await Contact.countDocuments({ status: 'resolved' });

        return res.status(200).json({
            success: true,
            data: {
                total: totalContacts,
                pending: pendingContacts,
                resolved: resolvedContacts,
                byType: stats,
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to retrieve contact statistics',
            details: error.message,
        });
    }
};

/**
 * @route   PUT /api/contacts/:id
 * @desc    Update contact inquiry
 * @access  Protected (Auth Required)
 */
export const handleUpdateContact = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await updateContactInquiry(req.params.id, req.body);

        if (result.error) {
            return res.status(400).json({
                error: result.error,
            });
        }

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.contact,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to update contact inquiry',
            details: error.message,
        });
    }
};

/**
 * @route   PUT /api/contacts/:id/status
 * @desc    Update contact inquiry status
 * @access  Protected (Auth Required)
 */
export const handleUpdateContactStatus = async (req: Request, res: Response): Promise<any> => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                error: 'Status is required',
            });
        }

        const result = await updateContactStatus(req.params.id, status);

        if (result.error) {
            return res.status(400).json({
                error: result.error,
            });
        }

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.contact,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to update contact status',
            details: error.message,
        });
    }
};

/**
 * @route   PUT /api/contacts/:id/resolve
 * @desc    Mark contact inquiry as resolved
 * @access  Protected (Auth Required)
 */
export const handleResolveContact = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { notes } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                error: 'Authentication required',
            });
        }

        const result = await resolveContactInquiry(req.params.id, userId.toString(), notes);

        if (result.error) {
            return res.status(400).json({
                error: result.error,
            });
        }

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.contact,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to resolve contact inquiry',
            details: error.message,
        });
    }
};

/**
 * @route   DELETE /api/contacts/:id
 * @desc    Delete contact inquiry
 * @access  Protected (Auth Required)
 */
export const handleDeleteContact = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await deleteContactInquiry(req.params.id);

        if (result.error) {
            return res.status(404).json({
                error: result.error,
            });
        }

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.contact,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to delete contact inquiry',
            details: error.message,
        });
    }
};

/**
 * @route   DELETE /api/contacts/bulk/delete
 * @desc    Delete multiple contact inquiries
 * @access  Protected (Auth Required)
 */
export const handleDeleteMultipleContacts = async (req: Request, res: Response): Promise<any> => {
    try {
        const { ids } = req.body;

        const result = await deleteMultipleContactInquiries(ids);

        if (result.error) {
            return res.status(400).json({
                error: result.error,
                invalidIds: result.invalidIds,
            });
        }

        return res.status(200).json({
            success: true,
            message: result.message,
            deletedCount: result.deletedCount,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to delete contact inquiries',
            details: error.message,
        });
    }
};

/**
 * @route   DELETE /api/contacts/old/:days
 * @desc    Delete contact inquiries older than specified days
 * @access  Protected (Auth Required)
 */
export const handleDeleteOldContacts = async (req: Request, res: Response): Promise<any> => {
    try {
        const { days } = req.params;
        const daysNum = parseInt(days);

        if (isNaN(daysNum) || daysNum < 1) {
            return res.status(400).json({
                error: 'Please provide a valid number of days (minimum 1)',
            });
        }

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysNum);

        const result = await Contact.deleteMany({
            createdAt: { $lt: cutoffDate },
            status: { $in: ['resolved', 'closed'] },
        });

        return res.status(200).json({
            success: true,
            message: `${result.deletedCount} old contact inquiries deleted successfully`,
            deletedCount: result.deletedCount,
            cutoffDate,
        });
    } catch (error: any) {
        return res.status(500).json({
            error: 'Failed to delete old contact inquiries',
            details: error.message,
        });
    }
};