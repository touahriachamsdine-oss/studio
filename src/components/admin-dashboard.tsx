
"use client";

import * as React from 'react';
import { events as initialEvents, venues as initialVenues } from '@/lib/data';
import type { Event, Venue } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const eventSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "Name is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    location: z.string().min(3, "Location is required"),
    description: z.string().min(10, "Description is required"),
    image: z.string().url("Must be a valid URL"),
    imageHint: z.string().min(2, "Image hint is required"),
    category: z.enum(['Music', 'Art', 'Food', 'Sports', 'Culture']),
    venueId: z.string().min(1, "Venue is required"),
});

const venueSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "Name is required"),
    address: z.string().min(5, "Address is required"),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
});

type EventFormValues = z.infer<typeof eventSchema>;
type VenueFormValues = z.infer<typeof venueSchema>;

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [events, setEvents] = React.useState<Event[]>(initialEvents);
  const [venues, setVenues] = React.useState<Venue[]>(initialVenues);
  
  const [isEventDialogOpen, setIsEventDialogOpen] = React.useState(false);
  const [isVenueDialogOpen, setIsVenueDialogOpen] = React.useState(false);

  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null);
  const [editingVenue, setEditingVenue] = React.useState<Venue | null>(null);

  const eventForm = useForm<EventFormValues>({ resolver: zodResolver(eventSchema) });
  const venueForm = useForm<VenueFormValues>({ resolver: zodResolver(venueSchema) });

  const handleAddEvent = () => {
    setEditingEvent(null);
    eventForm.reset({
        id: '',
        name: '',
        date: '',
        time: '',
        location: '',
        description: '',
        image: 'https://placehold.co/600x400.png',
        imageHint: '',
        category: 'Music',
        venueId: ''
    });
    setIsEventDialogOpen(true);
  };
  
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    eventForm.reset(event);
    setIsEventDialogOpen(true);
  };
  
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };
  
  const onEventSubmit: SubmitHandler<EventFormValues> = (data) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...data, id: e.id } : e));
    } else {
      setEvents([...events, { ...data, id: `e${Date.now()}` }]);
    }
    setIsEventDialogOpen(false);
  };
  
  const handleAddVenue = () => {
    setEditingVenue(null);
    venueForm.reset({ id: '', name: '', address: '', lat: 0, lng: 0 });
    setIsVenueDialogOpen(true);
  };

  const handleEditVenue = (venue: Venue) => {
    setEditingVenue(venue);
    venueForm.reset(venue);
    setIsVenueDialogOpen(true);
  };
  
  const handleDeleteVenue = (venueId: string) => {
    setVenues(venues.filter(v => v.id !== venueId));
  };

  const onVenueSubmit: SubmitHandler<VenueFormValues> = (data) => {
    if (editingVenue) {
      setVenues(venues.map(v => v.id === editingVenue.id ? { ...data, id: v.id } : v));
    } else {
      setVenues([...venues, { ...data, id: `v${Date.now()}` }]);
    }
    setIsVenueDialogOpen(false);
  };

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Welcome, Admin!</h2>
            <Button variant="outline" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
        </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Manage Events</CardTitle>
            <Button onClick={handleAddEvent}><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.map(event => (
                        <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.name}</TableCell>
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.location}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}><Pencil className="h-4 w-4" /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the event.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Manage Venues</CardTitle>
            <Button onClick={handleAddVenue}><PlusCircle className="mr-2 h-4 w-4" /> Add Venue</Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {venues.map(venue => (
                        <TableRow key={venue.id}>
                            <TableCell className="font-medium">{venue.name}</TableCell>
                            <TableCell>{venue.address}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditVenue(venue)}><Pencil className="h-4 w-4" /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the venue.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteVenue(venue.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            </DialogHeader>
            <Form {...eventForm}>
                <form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-4">
                    <FormField control={eventForm.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Event Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={eventForm.control} name="date" render={({ field }) => (
                            <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={eventForm.control} name="time" render={({ field }) => (
                            <FormItem><FormLabel>Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField control={eventForm.control} name="location" render={({ field }) => (
                        <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={eventForm.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={eventForm.control} name="category" render={({ field }) => (
                            <FormItem><FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="Music">Music</SelectItem>
                                        <SelectItem value="Art">Art</SelectItem>
                                        <SelectItem value="Food">Food</SelectItem>
                                        <SelectItem value="Sports">Sports</SelectItem>
                                        <SelectItem value="Culture">Culture</SelectItem>
                                    </SelectContent>
                                </Select>
                            <FormMessage /></FormItem>
                        )} />
                        <FormField control={eventForm.control} name="venueId" render={({ field }) => (
                            <FormItem><FormLabel>Venue</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a venue" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {venues.map(venue => <SelectItem key={venue.id} value={venue.id}>{venue.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            <FormMessage /></FormItem>
                        )} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={eventForm.control} name="image" render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={eventForm.control} name="imageHint" render={({ field }) => (
                            <FormItem><FormLabel>Image Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <Button type="submit">{editingEvent ? 'Save Changes' : 'Create Event'}</Button>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isVenueDialogOpen} onOpenChange={setIsVenueDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</DialogTitle>
            </DialogHeader>
            <Form {...venueForm}>
                <form onSubmit={venueForm.handleSubmit(onVenueSubmit)} className="space-y-4">
                    <FormField control={venueForm.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Venue Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={venueForm.control} name="address" render={({ field }) => (
                        <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={venueForm.control} name="lat" render={({ field }) => (
                            <FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={venueForm.control} name="lng" render={({ field }) => (
                            <FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <Button type="submit">{editingVenue ? 'Save Changes' : 'Create Venue'}</Button>
                </form>
            </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
