<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\CategoryMediaRequirement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CategoryMediaRequirementController extends Controller
{
    public function store(Request $request, BlogCategory $blogCategory): RedirectResponse
    {
        $data = $request->validate([
            'collection_name'    => ['required', 'string', 'in:' . implode(',', array_keys(BlogPost::MEDIA_COLLECTIONS))],
            'label'              => ['required', 'string', 'max:100'],
            'is_required'        => ['boolean'],
            'allowed_mime_types' => ['nullable', 'array'],
            'allowed_mime_types.*' => ['string', 'max:100'],
            'sort_order'         => ['integer', 'min:0'],
        ]);

        $blogCategory->mediaRequirements()->updateOrCreate(
            ['collection_name' => $data['collection_name']],
            $data
        );

        return back()->with('success', 'نیازمندی رسانه ذخیره شد.');
    }

    public function update(Request $request, BlogCategory $blogCategory, CategoryMediaRequirement $requirement): RedirectResponse
    {
        $this->authorizeRequirement($blogCategory, $requirement);

        $data = $request->validate([
            'label'              => ['required', 'string', 'max:100'],
            'is_required'        => ['boolean'],
            'allowed_mime_types' => ['nullable', 'array'],
            'allowed_mime_types.*' => ['string', 'max:100'],
            'sort_order'         => ['integer', 'min:0'],
        ]);

        $requirement->update($data);

        return back()->with('success', 'نیازمندی به‌روزرسانی شد.');
    }

    public function destroy(BlogCategory $blogCategory, CategoryMediaRequirement $requirement): RedirectResponse
    {
        $this->authorizeRequirement($blogCategory, $requirement);
        $requirement->delete();

        return back()->with('success', 'نیازمندی حذف شد.');
    }

    private function authorizeRequirement(BlogCategory $category, CategoryMediaRequirement $requirement): void
    {
        abort_unless($requirement->blog_category_id === $category->id, 404);
    }
}
