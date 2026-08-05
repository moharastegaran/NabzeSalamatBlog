<?php

namespace App\Http\Controllers;

use App\Exports\DynamicExport;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Mpdf\Mpdf;
use Mpdf\Output\Destination;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        abort_if(! $request->user()->hasRole(['admin', 'cfo']), 403);

        return Inertia::render('Reports/Index');
    }

    public function exportUsers(Request $request): BinaryFileResponse
    {
        abort_if(! $request->user()->hasRole(['admin', 'cfo']), 403);

        $columnDefs = $this->userColumnDefs();
        $columns    = $this->resolveColumns($request, $columnDefs);
        $users      = User::with(['roles', 'city.province'])->get();

        return $this->downloadXlsx('users', $columns, $columnDefs, $users);
    }

    public function exportUsersPdf(Request $request): HttpResponse
    {
        abort_if(! $request->user()->hasRole(['admin', 'cfo']), 403);

        $columnDefs = $this->userColumnDefs();
        $columns    = $this->resolveColumns($request, $columnDefs);

        return $this->renderPdf('کاربران', $columns, $columnDefs, User::with(['roles', 'city.province'])->get(), 'users');
    }

    private function userColumnDefs(): array
    {
        return [
            'id'           => ['header' => 'شناسه',             'value' => fn ($u) => $u->id],
            'name'         => ['header' => 'نام',               'value' => fn ($u) => $u->name],
            'email'        => ['header' => 'ایمیل',             'value' => fn ($u) => $u->email],
            'mobile'       => ['header' => 'موبایل',            'value' => fn ($u) => $u->mobile],
            'melli_code'   => ['header' => 'کد ملی',            'value' => fn ($u) => $u->melli_code],
            'user_role'    => ['header' => 'نقش کاربری',        'value' => fn ($u) => $u->getRoleNames()->implode(', ')],
            'is_suspended' => ['header' => 'وضعیت',             'value' => fn ($u) => $u->is_suspended ? 'معلق' : 'فعال'],
            'province_name'=> ['header' => 'استان',             'value' => fn ($u) => $u->city?->province?->name],
            'city_name'    => ['header' => 'شهر',               'value' => fn ($u) => $u->city?->name],
            'created_at'   => ['header' => 'تاریخ ثبت در سایت', 'value' => fn ($u) => $u->created_at?->format('Y-m-d')],
        ];
    }

    private function downloadXlsx(string $name, array $columns, array $columnDefs, iterable $rows): BinaryFileResponse
    {
        $headers = array_map(fn ($k) => $columnDefs[$k]['header'], $columns);

        $data = [];
        foreach ($rows as $row) {
            $data[] = array_map(fn ($k) => $columnDefs[$k]['value']($row), $columns);
        }

        return Excel::download(
            new DynamicExport($headers, $data),
            $name.'-'.now()->format('Y-m-d').'.xlsx',
        );
    }

    private function renderPdf(string $title, array $columns, array $columnDefs, iterable $rows, string $filename): HttpResponse
    {
        $headers = array_map(fn ($k) => $columnDefs[$k]['header'], $columns);

        $rowsHtml = '';
        foreach ($rows as $row) {
            $cells = array_map(fn ($k) => '<td>'.e($columnDefs[$k]['value']($row)).'</td>', $columns);
            $rowsHtml .= '<tr>'.implode('', $cells).'</tr>';
        }

        $headCells = implode('', array_map(fn ($h) => '<th>'.e($h).'</th>', $headers));

        $html = <<<HTML
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
            <meta charset="UTF-8">
            <style>
                body  { font-family: dejavusans; direction: rtl; font-size: 11px; color: #111827; }
                h2    { font-size: 15px; margin-bottom: 12px; color: #1e1b4b; }
                table { width: 100%; border-collapse: collapse; }
                th    { background: #4f46e5; color: #fff; padding: 7px 8px; text-align: right; font-size: 11px; }
                td    { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; }
                tr:nth-child(even) td { background: #f9fafb; }
            </style>
            </head>
            <body>
            <h2>گزارش {$title}</h2>
            <table>
              <thead><tr>{$headCells}</tr></thead>
              <tbody>{$rowsHtml}</tbody>
            </table>
            </body>
            </html>
            HTML;

        $mpdf = new Mpdf([
            'format'         => 'A4-L',
            'margin_top'     => 15,
            'margin_bottom'  => 15,
            'margin_left'    => 12,
            'margin_right'   => 12,
            'default_font'   => 'dejavusans',
            'autoLangToFont' => false,
            'autoArabic'     => true,
            'tempDir'        => storage_path('app/mpdf'),
        ]);

        $mpdf->SetDirectionality('rtl');
        $mpdf->WriteHTML($html);

        return response($mpdf->Output('', Destination::STRING_RETURN), 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$filename.'-'.now()->format('Y-m-d').'.pdf"',
        ]);
    }

    private function resolveColumns(Request $request, array $columnDefs): array
    {
        $allowed   = array_keys($columnDefs);
        $requested = $request->input('columns', $allowed);

        return array_values(array_intersect($allowed, (array) $requested));
    }
}
