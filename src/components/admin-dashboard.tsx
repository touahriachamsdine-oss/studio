
"use client";

import * as React from 'react';
import { events as initialEvents, venues as initialVenues } from '@/lib/data';
import { pointsOfInterest as initialPois } from '@/lib/points-of-interest';
import type { Event, Venue, PointOfInterest } from '@/lib/types';
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
import { LogOut, Pencil, PlusCircle, Trash2, Send, Users, Settings2, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

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

const poiSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "Name is required"),
    description: z.string().min(10, "Description is required"),
    category: z.string().min(3, "Category is required"),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
});

const pushSchema = z.object({
    title: z.string().min(3, "Title is required"),
    message: z.string().min(10, "Message is required"),
});

const promptSchema = z.object({
    itineraryPrompt: z.string().min(20, "Prompt is too short."),
    suggestionsPrompt: z.string().min(20, "Prompt is too short."),
});

type EventFormValues = z.infer<typeof eventSchema>;
type VenueFormValues = z.infer<typeof venueSchema>;
type PoiFormValues = z.infer<typeof poiSchema>;
type PushFormValues = z.infer<typeof pushSchema>;
type PromptFormValues = z.infer<typeof promptSchema>;


interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { toast } = useToast();
  const [events, setEvents] = React.useState<Event[]>(initialEvents);
  const [venues, setVenues] = React.useState<Venue[]>(initialVenues);
  const [pois, setPois] = React.useState<PointOfInterest[]>(initialPois);
  
  const [isEventDialogOpen, setIsEventDialogOpen] = React.useState(false);
  const [isVenueDialogOpen, setIsVenueDialogOpen] = React.useState(false);
  const [isPoiDialogOpen, setIsPoiDialogOpen] = React.useState(false);

  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null);
  const [editingVenue, setEditingVenue] = React.useState<Venue | null>(null);
  const [editingPoi, setEditingPoi] = React.useState<PointOfInterest | null>(null);
  
  const eventForm = useForm<EventFormValues>({ resolver: zodResolver(eventSchema) });
  const venueForm = useForm<VenueFormValues>({ resolver: zodResolver(venueSchema) });
  const poiForm = useForm<PoiFormValues>({ resolver: zodResolver(poiSchema) });
  const pushForm = useForm<PushFormValues>({ resolver: zodResolver(pushSchema) });
  const promptForm = useForm<PromptFormValues>({ 
    resolver: zodResolver(promptSchema),
    defaultValues: {
        itineraryPrompt: "You are an expert tourist guide for Mostaganem, Algeria. A tourist has the following interests: {{{interests}}}. Generate a personalized tourist itinerary with suggested routes and points of interest. Make sure that the itinerary is well-organized, easy to follow, and includes estimated times for each activity. The itinerary should also include restaurant recommendations that align with the tourist's interests.",
        suggestionsPrompt: "You are a tourist guide expert in Mostaganem. Based on the user's past interactions and their stated interests, provide a list of personalized suggestions for points of interest and routes. User Interactions: {{{userInteractions}}}. Interests: {{{interests}}}. Suggestions:",
    }
  });

  const handleAddEvent = () => {
    setEditingEvent(null);
    eventForm.reset({ id: '', name: '', date: '', time: '', location: '', description: '', image: 'https://placehold.co/600x400.png', imageHint: '', category: 'Music', venueId: '' });
    setIsEventDialogOpen(true);
  };
  
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    eventForm.reset(event);
    setIsEventDialogOpen(true);
  };
  
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    toast({ title: "Event Deleted", description: "The event has been successfully removed." });
  };
  
  const onEventSubmit: SubmitHandler<EventFormValues> = (data) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...data, id: e.id } : e));
      toast({ title: "Event Updated", description: "The event has been successfully updated." });
    } else {
      setEvents([...events, { ...data, id: `e${Date.now()}` }]);
      toast({ title: "Event Created", description: "The new event has been successfully added." });
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
    toast({ title: "Venue Deleted", description: "The venue has been successfully removed." });
  };

  const onVenueSubmit: SubmitHandler<VenueFormValues> = (data) => {
    if (editingVenue) {
      setVenues(venues.map(v => v.id === editingVenue.id ? { ...data, id: v.id } : v));
      toast({ title: "Venue Updated", description: "The venue has been successfully updated." });
    } else {
      setVenues([...venues, { ...data, id: `v${Date.now()}` }]);
      toast({ title: "Venue Created", description: "The new venue has been successfully added." });
    }
    setIsVenueDialogOpen(false);
  };

  const handleAddPoi = () => {
    setEditingPoi(null);
    poiForm.reset({ id: '', name: '', description: '', category: '', lat: 0, lng: 0 });
    setIsPoiDialogOpen(true);
  };

  const handleEditPoi = (poi: PointOfInterest) => {
    setEditingPoi(poi);
    poiForm.reset(poi);
    setIsPoiDialogOpen(true);
  };
  
  const handleDeletePoi = (poiId: string) => {
    setPois(pois.filter(p => p.id !== poiId));
    toast({ title: "Point of Interest Deleted", description: "The POI has been successfully removed." });
  };

  const onPoiSubmit: SubmitHandler<PoiFormValues> = (data) => {
    if (editingPoi) {
      setPois(pois.map(p => p.id === editingPoi.id ? { ...data, id: p.id } : p));
      toast({ title: "POI Updated", description: "The POI has been successfully updated." });
    } else {
      setPois([...pois, { ...data, id: `p${Date.now()}` }]);
      toast({ title: "POI Created", description: "The new POI has been successfully added." });
    }
    setIsPoiDialogOpen(false);
  };
  
  const onPushSubmit: SubmitHandler<PushFormValues> = (data) => {
    console.log("Sending push notification:", data);
    toast({
      title: "Push Notification Sent",
      description: `Title: ${data.title}`,
    });
    pushForm.reset({ title: '', message: '' });
  };
  
  const onPromptSubmit: SubmitHandler<PromptFormValues> = (data) => {
    console.log("Updating AI Prompts:", data);
    toast({
      title: "AI Prompts Updated",
      description: "The AI prompts have been successfully saved.",
    });
  };

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Welcome, Admin!</h2>
            <Button variant="outline" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Send className="text-primary"/> Push Notifications</CardTitle>
                    <CardDescription>Send a notification to all users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...pushForm}>
                        <form onSubmit={pushForm.handleSubmit(onPushSubmit)} className="space-y-4">
                            <FormField control={pushForm.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} placeholder="e.g., Event Reminder" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={pushForm.control} name="message" render={({ field }) => (
                                <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea {...field} placeholder="e.g., Don't miss the Festival de Musique tonight!" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="submit">Send Notification</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings2 className="text-primary"/> AI Settings</CardTitle>
                    <CardDescription>Manage the prompts used by the generative AI.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...promptForm}>
                        <form onSubmit={promptForm.handleSubmit(onPromptSubmit)} className="space-y-4">
                            <FormField control={promptForm.control} name="itineraryPrompt" render={({ field }) => (
                                <FormItem><FormLabel>Tourist Itinerary Prompt</FormLabel><FormControl><Textarea {...field} rows={6} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={promptForm.control} name="suggestionsPrompt" render={({ field }) => (
                                <FormItem><FormLabel>Personalized Suggestions Prompt</FormLabel><FormControl><Textarea {...field} rows={6} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Button type="submit">Save Prompts</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>

        <Separator />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><Database className="text-primary"/> Data Management</CardTitle>
                    <CardDescription>Manage all application data from one place.</CardDescription>
                </div>
                <Button disabled>
                    <Users className="mr-2 h-4 w-4" /> Manage Users
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Events</h3>
                      <Button onClick={handleAddEvent} size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button>
                  </div>
                  <div className="border rounded-md">
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Name</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {events.map(event => (
                                  <TableRow key={event.id}>
                                      <TableCell className="font-medium truncate max-w-xs">{event.name}</TableCell>
                                      <TableCell>{event.date}</TableCell>
                                      <TableCell className="text-right space-x-1">
                                          <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}><Pencil className="h-4 w-4" /></Button>
                                          <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the event.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Venues</h3>
                      <Button onClick={handleAddVenue} size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Venue</Button>
                  </div>
                   <div className="border rounded-md">
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Name</TableHead><TableHead>Address</TableHead><TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {venues.map(venue => (
                                  <TableRow key={venue.id}>
                                      <TableCell className="font-medium truncate max-w-xs">{venue.name}</TableCell>
                                      <TableCell className="truncate max-w-xs">{venue.address}</TableCell>
                                      <TableCell className="text-right space-x-1">
                                          <Button variant="ghost" size="icon" onClick={() => handleEditVenue(venue)}><Pencil className="h-4 w-4" /></Button>
                                          <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the venue.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteVenue(venue.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </div>
                </div>
                 <div>
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Points of Interest</h3>
                      <Button onClick={handleAddPoi} size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add POI</Button>
                  </div>
                   <div className="border rounded-md">
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {pois.map(poi => (
                                  <TableRow key={poi.id}>
                                      <TableCell className="font-medium truncate max-w-xs">{poi.name}</TableCell>
                                      <TableCell>{poi.category}</TableCell>
                                      <TableCell className="text-right space-x-1">
                                          <Button variant="ghost" size="icon" onClick={() => handleEditPoi(poi)}><Pencil className="h-4 w-4" /></Button>
                                          <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the Point of Interest.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeletePoi(poi.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>

      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
            <DialogHeader><DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle></DialogHeader>
            <Form {...eventForm}><form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-4">
                <FormField control={eventForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Event Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={eventForm.control} name="date" render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={eventForm.control} name="time" render={({ field }) => (<FormItem><FormLabel>Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={eventForm.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={eventForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={eventForm.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Music">Music</SelectItem><SelectItem value="Art">Art</SelectItem><SelectItem value="Food">Food</SelectItem><SelectItem value="Sports">Sports</SelectItem><SelectItem value="Culture">Culture</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={eventForm.control} name="venueId" render={({ field }) => (<FormItem><FormLabel>Venue</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a venue" /></SelectTrigger></FormControl><SelectContent>{venues.map(venue => <SelectItem key={venue.id} value={venue.id}>{venue.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={eventForm.control} name="image" render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={eventForm.control} name="imageHint" render={({ field }) => (<FormItem><FormLabel>Image Hint</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <Button type="submit">{editingEvent ? 'Save Changes' : 'Create Event'}</Button>
            </form></Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isVenueDialogOpen} onOpenChange={setIsVenueDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader><DialogTitle>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</DialogTitle></DialogHeader>
            <Form {...venueForm}><form onSubmit={venueForm.handleSubmit(onVenueSubmit)} className="space-y-4">
                <FormField control={venueForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Venue Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={venueForm.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={venueForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={venueForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <Button type="submit">{editingVenue ? 'Save Changes' : 'Create Venue'}</Button>
            </form></Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPoiDialogOpen} onOpenChange={setIsPoiDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader><DialogTitle>{editingPoi ? 'Edit POI' : 'Add New POI'}</DialogTitle></DialogHeader>
            <Form {...poiForm}><form onSubmit={poiForm.handleSubmit(onPoiSubmit)} className="space-y-4">
                <FormField control={poiForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>POI Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={poiForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={poiForm.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., History, Landmark, Food" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={poiForm.control} name="lat" render={({ field }) => (<FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={poiForm.control} name="lng" render={({ field }) => (<FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <Button type="submit">{editingPoi ? 'Save Changes' : 'Create POI'}</Button>
            </form></Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
