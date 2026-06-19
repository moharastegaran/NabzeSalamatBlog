<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\CategoryFieldDefinition;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryFieldDefinitionController extends Controller
{
    public function store(Request $request, BlogCategory $blogCategory): RedirectResponse
    {
        $data = $request->validate([
            'field_key'  => ['required', 'string', 'max:100', 'regex:/^[a-z_][a-z0-9_]*$/'],
            'field_type' => ['required', Rule::in(CategoryFieldDefinition::FIELD_TYPES)],
            'label'      => ['required', 'string', 'max:100'],
            'is_required' => ['boolean'],
            'options'    => ['nullable', 'array'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        if ($data['field_type'] === 'file') {
            $request->validate([
                'field_key' => [Rule::in(array_keys(BlogPost::MEDIA_COLLECTIONS))],
            ]);
        }

        if ($blogCategory->fieldDefinitions()->where('field_key', $data['field_key'])->exists()) {
            return back()->withErrors(['field_key' => 'این کلید در این دسته‌بندی قبلاً استفاده شده است.']);
        }

        $data['blog_category_id'] = $blogCategory->id;
        CategoryFieldDefinition::create($data);

        return back()->with('success', 'فیلد ذخیره شد.');
    }

    public function update(Request $request, BlogCategory $blogCategory, CategoryFieldDefinition $field): RedirectResponse
    {
        $this->authorizeField($blogCategory, $field);

        $data = $request->validate([
            'label'      => ['required', 'string', 'max:100'],
            'is_required' => ['boolean'],
            'options'    => ['nullable', 'array'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $field->update($data);

        return back()->with('success', 'فیلد به‌روزرسانی شد.');
    }

    public function destroy(BlogCategory $blogCategory, CategoryFieldDefinition $field): RedirectResponse
    {
        $this->authorizeField($blogCategory, $field);
        $field->delete();

        return back()->with('success', 'فیلد حذف شد.');
    }

    private function authorizeField(BlogCategory $category, CategoryFieldDefinition $field): void
    {
        abort_unless($field->blog_category_id === $category->id, 404);
    }
}
