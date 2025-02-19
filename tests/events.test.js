const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Event = require('../models/eventModel');
const connectDb = require('../configs/db');

describe('GET /upcoming', () => {
	beforeAll(async () => {
		await connectDb();
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	beforeEach(async () => {
		await Event.deleteMany({});
	});

	it('should return a list of upcoming events with pagination', async () => {
		await Event.create([
			{
				title: 'Event 1',
				description: 'Test event 1',
				startDate: new Date(Date.now() + 3600000),
				state: 'upcoming',
			},
			{
				title: 'Event 2',
				description: 'Test event 2',
				startDate: new Date(Date.now() + 3600000),
				state: 'upcoming',
			},
			{
				title: 'Event 3',
				description: 'Test event 3',
				startDate: new Date(Date.now() + 3600000),
				state: 'upcoming',
			},
			{
				title: 'Event 4',
				description: 'Test event 4',
				startDate: new Date(Date.now() + 3600000),
				state: 'upcoming',
			},
			{
				title: 'Event 5',
				description: 'Test event 5',
				startDate: new Date(Date.now() + 3600000),
				state: 'upcoming',
			},
			{
				title: 'Event 6',
				description: 'Test event 6',
				startDate: new Date(Date.now() + 8600000),
				state: 'upcoming',
			},
			{
				title: 'Event 7',
				description: 'Test event 7',
				startDate: new Date(Date.now() + 3600000),
				state: 'upcoming',
			},
			{
				title: 'Event 8',
				description: 'Test event 8',
				startDate: new Date(Date.now() + 7600000),
				state: 'upcoming',
			},
			{
				title: 'Event 9',
				description: 'Test event 9',
				startDate: new Date(Date.now() + 3600000),
				state: 'upcoming',
			},
			{
				title: 'Event 10',
				description: 'Test event 10',
				startDate: new Date(Date.now() + 3600000),
				state: 'upcoming',
			},
		]);

		const res = await request(app)
			.get('/api/events/upcoming?page=1&limit=4')
			.expect(200);

		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toBe('Fetched Upcoming Events Successfully.');
		expect(res.body.data).toHaveLength(4);
		expect(res.body.pagination.currentPage).toBe(1);
		expect(res.body.pagination.totalPages).toBe(3);
		expect(res.body.pagination.totalUpcomingEvents).toBe(10);
	});

	it('should return a message indicating no upcoming events if none exist', async () => {
		const res = await request(app)
			.get('/api/events/upcoming?page=1&limit=4')
			.expect(404);

		expect(res.body.message).toBe('No upcoming events at the moment.');
	});

	it('should return a 400 error for an invalid page number', async () => {
		const res = await request(app)
			.get('/api/events/upcoming?page=-1&limit=5')
			.expect(400);

		expect(res.body.message).toBe(
			'Invalid page number. Page must be 1 or greater.'
		);
	});
});

// describe('GET  /', () => {
// 	beforeAll(async () => {
// 		await connectDb();
// 	});

// 	afterAll(async () => {
// 		await mongoose.connection.close();
// 	});

// 	beforeEach(async () => {
// 		await Event.deleteMany({});
// 	});

// 	it('should return an empty array when there are no events', async () => {
// 		const res = await request(app).get('/api/events/').expect(200);

// 		expect(res.statusCode).toEqual(200);
// 		expect(res.body.message).toBe('Events fetched successfully');
// 	});
// });
