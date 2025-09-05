"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { use } from 'react'
import FileUpload from '@/components/FileUpload'
import { Formik } from 'formik'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader } from "lucide-react";
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
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
} from "@/components/ui/alert-dialog"

const supabase = createClient()

type ListingImage = {
    url: string
    path: string
    created_at?: string
}


// Make properties optional or match Supabase's structure
interface UserData {
    id: string;
    email?: string;
    user_metadata?: {
        full_name?: string;
        name?: string;
        // other metadata fields
    };
}

interface Listing {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url?: string;
    type: string;
    propertyType: string;
    bedroom: string;
    bathroom: string;
    builtIn: string;
    parking: string;
    lotSize: string;
    area: string;
    hoa: string;
    active: string;
    address: string;
    coordinates: { lat: number; lng: number };
    createdBy: string;
    listingimages: ListingImage[];
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown; // Index signature for dynamic access

}


function EditListing({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const [user, setUser] = useState<UserData | null>(null);
    const [isOwner, setIsOwner] = useState(false)
    const [loading, setLoading] = useState(true)
    const [listing, setListing] = useState<Listing | null>(null);
    const [images, setImages] = useState<File[]>([])

    // Fetch listing data with images
    useEffect(() => {
        if (!id) return

        const fetchData = async () => {
            setLoading(true)

            try {
                // Check auth
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error || !user) {
                    router.push('/login')
                    return
                }
                setUser(user)

                // Fetch listing with images
                const { data, error: listingError } = await supabase
                    .from('listing')
                    .select(`
            *,
            listingimages(
              url,
              path,
              created_at
            )
          `)
                    .eq('id', id)
                    .eq('createdBy', user.email)
                    .single()

                if (listingError || !data) {
                    router.push('/')
                    return
                }

                setListing(data)
                setIsOwner(true)
            } catch (error) {
                console.error('Error fetching listing:', error)
                toast.error('Failed to load listing')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, router])

    // Handle image upload
    const uploadImages = async () => {
        if (!images.length) return []

        const uploadedUrls = []
        for (const image of images) {
            try {
                const fileExt = image.name.split('.').pop()?.toLowerCase() || 'jpg'
                const fileName = `listings/${id}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

                // Upload to storage
                const { data, error } = await supabase.storage
                    .from('listingimages')
                    .upload(fileName, image, {
                        contentType: image.type,
                        upsert: false,
                        cacheControl: '3600'
                    })

                if (error) throw error

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('listingimages')
                    .getPublicUrl(data.path)

                // Store image metadata
                const { error: insertError } = await supabase
                    .from('listingimages')
                    .insert([{
                        listing_id: id,
                        url: publicUrl,
                        path: data.path
                    }])

                if (insertError) throw insertError

                uploadedUrls.push(publicUrl)
            } catch (error) {
                console.error('Error uploading image:', error)
                toast.error(`Failed to upload ${image.name}`)
            }
        }

        return uploadedUrls
    }

    // Handle image deletion
    const handleDeleteImage = async (path: string) => {
        try {
            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from('listingimages')
                .remove([path])

            if (storageError) throw storageError

            // Delete from database
            const { error: dbError } = await supabase
                .from('listingimages')
                .delete()
                .eq('path', path)

            if (dbError) throw dbError

            // Update local state
            setListing((prev: any) => ({
                ...prev,
                listingimages: prev.listingimages.filter((img: ListingImage) => img.path !== path)
            }))
        } catch (error) {
            console.error('Error deleting image:', error)
            throw error
        }
    }

    // Form submission
    const onSubmitHandler = async (formValue: any) => {
        if (!isOwner) {
            toast.error('Unauthorized')
            return
        }

        try {
            // Upload new images
            await uploadImages()

            // Update listing data (excluding images)
            if (!user) {
                toast.error('User not found');
                return;
            }
            const { error } = await supabase
                .from('listing')
                .update(formValue)
                .eq('id', id)
                .eq('createdBy', user.email)

            if (error) throw error

            toast.success('Listing updated successfully!')
            router.push('/dashboard')
        } catch (error) {
            console.error('Submission error:', error)
            toast.error('Failed to update listing')
        }
    }

    const publishBtnHandler = async () => {

        const { data, error } = await supabase
            .from('listing')
            .update({ active: 'true' })
            .eq('id', id)
            .select()

        if (data) {
            setLoading(false)
            toast.success('Listing published successfully!')
        }

    }

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
    if (!isOwner || !listing) return null

    return (
        <div className="mt-30 px-10 md:px-36 my-10">
            <h2 className='font-bold text-2xl'>Edit Listing</h2>

            <Formik
                initialValues={{
                    type: listing.type || 'Sell',
                    propertyType: listing.propertyType || '',
                    bedroom: listing.bedroom || '',
                    bathroom: listing.bathroom || '',
                    builtIn: listing.builtIn || '',
                    parking: listing.parking || '',
                    lotSize: listing.lotSize || '',
                    area: listing.area || '',
                    price: listing.price || '',
                    hoa: listing.hoa || '',
                    description: listing.description || '',
                }}
                onSubmit={onSubmitHandler}
                enableReinitialize
            >
                {({ values, handleChange, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <div className='p-8 rounded-lg shadow-md'>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Rent or Sell?</h2>
                                    <RadioGroup
                                        name="type"
                                        value={values.type}
                                        onValueChange={(value) => setFieldValue("type", value)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Rent" id="option-one" />
                                            <Label htmlFor="Rent">Rent</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Sell" id="option-two" />
                                            <Label htmlFor="Sell">Sell</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Property Type</h2>
                                    <Select
                                        value={values.propertyType}
                                        onValueChange={(value) => values.propertyType = value}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Property Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Single Family House">Single Family House</SelectItem>
                                            <SelectItem value="Town House">Town House</SelectItem>
                                            <SelectItem value="Condo">Condo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                                {[
                                    { name: 'bedroom', label: 'Bedroom', placeholder: 'Ex. 2' },
                                    { name: 'bathroom', label: 'Bathroom', placeholder: 'Ex. 2' },
                                    { name: 'builtIn', label: 'Built In', placeholder: 'Ex. 1900 Sq.ft' },
                                    { name: 'parking', label: 'Parking', placeholder: 'Ex. 2' },
                                    { name: 'lotSize', label: 'Lot Size (Sq.Ft)', placeholder: 'Ex. 2000' },
                                    { name: 'area', label: 'Area (Sq.Ft)', placeholder: 'Ex. 1900' },
                                    { name: 'price', label: 'Selling Price', placeholder: '400000' },
                                    { name: 'hoa', label: 'HOA (Per Month) ($)', placeholder: '100' },
                                ].map((field) => (
                                    <div key={field.name} className='flex gap-2 flex-col'>
                                        <h2 className='text-gray-500'>{field.label}</h2>
                                        <Input
                                            type={field.name === 'price' || field.name === 'hoa' ? 'number' : 'text'}
                                            placeholder={field.placeholder}
                                            name={field.name}
                                            defaultValue={String(listing[field.name] ?? '')}
                                            onChange={handleChange}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className='mb-8'>
                                <h2 className='text-gray-500 mb-2'>Description</h2>
                                <Textarea
                                    placeholder="Enter property description"
                                    name="description"
                                    defaultValue={listing.description || ''}
                                    onChange={handleChange}
                                    rows={5}
                                />
                            </div>

                            <div className='mb-8'>
                                <h2 className='text-lg text-gray-500 mb-4'>Property Images</h2>
                                <FileUpload
                                    setImages={setImages}
                                    existingImages={listing.listingimages || []}
                                    onDeleteImage={handleDeleteImage}
                                />
                            </div>

                            <div className='flex gap-4 justify-end'>
                                <Button
                                    disabled={loading}
                                    variant="outline"
                                    className="text-indigo-600 border-indigo-600">
                                    {loading ? <Loader className='animate-spin' /> : 'Save'}
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button type="button" disabled={loading} className="">
                                            {loading ? <Loader className='animate-spin' /> : 'Save & Publish'}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Ready to Publish?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Do you really want to Publish the listing?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => publishBtnHandler()}>
                                                {loading ? <Loader className='animate-speed' /> : 'Continue'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    )
}

export default EditListing